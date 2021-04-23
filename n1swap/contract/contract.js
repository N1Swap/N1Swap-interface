pragma solidity ^0.6.0;

import "testERC20.sol";
import "SafeMath.sol";

struct TPairAmount {
    uint256 amountA;
    uint256 amountB;
}

struct TLPToken {
    uint256 amount;
    mapping (address => uint256) balance;
}

struct TNSTShare {
    uint mintedAmount;  /// 当前已经铸造出来的总量
    uint sentAmount;    /// 已经发送出去的总量
    uint lastMintTime;  /// 上一次铸造的时间
    uint amountPerDay;  /// 每天应该铸造出来的数量
}



contract N1SwapToken is TRC20  {
    constructor() public override {
        _symbol = "NST";
        _name = "N1Swap Token";
        _decimals = 6;
        _totalSupply = 4000000000 * (10 ** 6);
        
        _balanceOf[msg.sender] = _totalSupply;
    }
}


contract TestCaller {
    event CallerIs(address sender, address origin, uint value);
}


contract N1Swap{
    using SafeMath for uint;
    
    /**
     * 这是合约的管理者地址，或者说管理者
     */
    address public factory;
    
    /**
     * 这是更换合约管理者时的临时变量
     * 更换合约管理者时，首先调用 changeFactory() 方法设置新的合约管理者，然后使用新的合约管理者调用 confirmChangeFacotyr() 方法，调用成功后即完成合约所有者的更改。
     * 需要进行两部操作是为了防止直接更改 factory 时传入错误的参数，导致合约永远失去管理者。
     */
    address public candidateFactory;
    
    /**
     * 对应的 NST 合约地址 
     */
    address NSTAddress;
    
    /**
     * 分用户流动性资产表
     * mapping(token => mapping(user => amount))
     */
    //mapping(address => mapping(address => uint96)) liquidityMap;
    
    /**
     * 交易对自己的流动性资产表
     * mapping(tokenA => mapping(tokenB => TPairAmount))    // MUST tokenA < tokenB
     */
    mapping(address => mapping(address => TPairAmount)) pairLiquidity;
    
    /**
     * LP Token 记录表 
     */
    //mapping(address => mapping(address => mapping(address => uint256))) LPTokenTable;           /// 记录每个地址当前持有的 LPToken 数量 (tokenA =)
    mapping (address => mapping(address => TLPToken)) LPTokenTable;                              /// 已经铸造的 LPToken 总量 (tokenA => (tokenB => amount))
    
    /**
     * 引荐来源记录表
     */
    mapping(address => address) public refererTable;       /// 引荐记录表 (被邀请的人 => 发送邀请的人)
    
    /**
     * 做市商收入资金池
     */
    mapping(address => uint256) lpFeePool;
    
    
    /**
     * NST 铸造数据
     */
    mapping(address => mapping(address => TNSTShare)) NSTMintTable;   /// NST 铸造记录表
    
    
    event FactoryChanged(address oldFactory, address newFactory);
    event FactoryCandidated(address newFactory);
    
    event beforeAddLiquidity(address tokenA, uint amountA, address tokenB, uint amountB, uint currentValueA,  uint currentValueB, address adder);
    event afterAddLiquidity(uint afterAmountA, uint afterAmountB);
    event beforeRemoveLiquidity(address tokenA, address tokenB, address token, uint currentValue, uint removeValue, address remover);
    event afterRemoveLiquidity(address tokenA, address tokenB, address token, uint afterValue);
    event removeLiquidityProfitLog(address token, uint ratioPPM, uint feeProfitAmount, uint removeAmount, uint beforeFeePoolAmount);
    event removeLiquidityGotAmount(uint ratioPPT, uint gotAmountA, uint gotAmountB, uint gotFeeAmountA, uint gotFeeAmountB);
    
    event onSwap(address tokenIn, uint amountIn, address tokenOut, uint amountInBefore, uint amountOutBefore, uint amountInAfter, uint amountOutAfter, uint gotAmount);
    event onSwapTakeFee(address tokenOut, uint gotAmount, uint fee);
    
    event onSlippagePPM(uint96 slippagePPM, uint maxSlippagePPM);
    
    event onLPTokenMint(address tokenA, address tokenB, address to, uint256 amount);
    event onLPTokenBurn(address tokenA, address tokenB, address _from, uint256 amount);
    
    constructor() public {
        factory = msg.sender;
        candidateFactory = address(0);
        NSTAddress = address(0x4D8B941CFF6FDB27B72CCC0640FED8661A91C5B1E208B5C5272000);
    }
    
    function setNSTAddress(address addr) public onlyFactory {
        NSTAddress = addr;
    }

    
    function writeA(address token1, address token2, uint256 amount) public {
        address tokenA;
        address tokenB;
        if (token1 < token2) {
            tokenA = token1;
            tokenB = token2;
        } else {
            tokenA = token2;
            tokenB = token1;
        }
        pairLiquidity[tokenA][tokenB].amountA = amount;
    }
    
    function writeB(address token1, address token2, uint256 amount) public {
        address tokenA;
        address tokenB;
        if (token1 < token2) {
            tokenA = token1;
            tokenB = token2;
        } else {
            tokenA = token2;
            tokenB = token1;
        }
        pairLiquidity[tokenA][tokenB].amountB = amount;
    }
    
    
    
    function changeFactory(address to) public {
        require(msg.sender == factory, "N1Swap::changeFactory: Sender is not factory");
        
        emit FactoryCandidated(to);
        
        candidateFactory = to;
    }
    
    function confirmChangeFactory() public {
        require(msg.sender == candidateFactory, "N1Swap::confirmChangeFactory: Sender is not candidated factory");
        require(msg.sender != address(0), "N1Swap::confirmChangeFactory: No candidate factory specified");
        
        emit FactoryChanged(factory, msg.sender);
        
        factory = msg.sender;
        candidateFactory = address(0);
    }

    function mintLPToken(address token1, address token2, address to, uint256 amount) private {
        address tokenA;
        address tokenB;
        (tokenA, tokenB) = sortToken(token1, token2);
        
        uint256 beforeAmount = LPTokenTable[tokenA][tokenB].balance[to];
        uint256 afterAmount = SafeMath.add(beforeAmount, amount);
        LPTokenTable[tokenA][tokenB].balance[to] = afterAmount;
        
        emit onLPTokenMint(tokenA, tokenB, to, amount);
    }
    
    function burnLPToken(address token1, address token2, address _from, uint256 amount) private {
        address tokenA;
        address tokenB;
        (tokenA, tokenB) = sortToken(token1, token2);
        
        uint256 beforeAmount = LPTokenTable[tokenA][tokenB].balance[_from];
        uint256 afterAmount = SafeMath.sub(beforeAmount, amount);
        LPTokenTable[tokenA][tokenB].balance[_from] = afterAmount;
        
        emit onLPTokenBurn(tokenA, tokenB, _from, amount);
    }
    
    function calcMintLPTokenAmount(address token1, uint256 amount1, address token2, uint256 amount2) public view returns (uint256, uint lossPPT) {
        address tokenA;
        address tokenB;
        (tokenA, tokenB) = sortToken(token1, token2);
        
        uint256 amountA;
        uint256 amountB;
        
        if (tokenA == token1) {
            amountA = amount1;
            amountB = amount2;
        } else {
            amountA = amount2;
            amountB = amount1;
        }
        
        uint256 ratioA = amountA * 1e12 / pairLiquidity[tokenA][tokenB].amountA;
        uint256 ratioB = amountB * 1e12 / pairLiquidity[tokenA][tokenB].amountB;
        
        uint ratio;
        if (ratioA < ratioB) {
            ratio = ratioA;
            lossPPT = ratioB - ratioA;
        } else {
            ratio = ratioB;
            lossPPT = ratioA - ratioB;
        }
        
        uint256 mintAmount = LPTokenTable[tokenA][tokenB].amount * 1e12 / ratio;
        return (mintAmount, lossPPT);
    }
    
    
    /**
     * 获取一个 LP Token 的发行总量
     */
    function getLPTokenAmount(address token1, address token2) public view returns (uint256) {
        address tokenA;
        address tokenB;
        (tokenA, tokenB) = sortToken(token1, token2);
        
        return LPTokenTable[tokenA][tokenB].amount;
    }
    
    /**
     * 获取一个用户的 LP Token 余额 
     */
    function getLPTokenBalance(address token1, address token2, address user) public view returns (uint256) {
        address tokenA;
        address tokenB;
        (tokenA, tokenB) = sortToken(token1, token2);
        
        return LPTokenTable[tokenA][tokenB].balance[user];
    }
    
    
    /**
     * 增加流动性
     * 传入交易对的代币的合约地址，顺序不分先后。
     * 如果传入 0 地址，则表示使用 TRX，这时候必须在此交易中附带足够金额的 TRX
     * 
     * @param maxLossPPT   最大容忍的价格变动比例，如果传入 1%，则表示在价格变动超过 1% 的情况下，拒绝交易
     */
    function addLiquidity(address token1, uint96 amount1, address token2, uint96 amount2, uint maxLossPPT) public payable {
        address tokenA;
        address tokenB;
        uint96 amountA;
        uint96 amountB;
        
        if (token1 < token2) {
            tokenA = token1;
            amountA = amount1;
            tokenB = token2;
            amountB = amount2;
        } else if (token1 > token2) {
            tokenA = token2;
            amountA = amount2;
            tokenB = token1;
            amountB = amount1;
        } else {
            require(false, "N1Swap::addLiquidity: token1 == token2 is not allowed");
        }
        
        emit beforeAddLiquidity(tokenA, amountA, tokenB, amountB, pairLiquidity[tokenA][tokenB].amountA,  pairLiquidity[tokenA][tokenB].amountB, msg.sender);
        
        if (tokenA == address(0)) {
            /// 这是一个与 TRX 相关的流动性，进行额外的检查
            require(amountA > 0, "N1Swap::addLiquidity: Invalid amount");
            require(msg.value == amountA, "N1Swap::addLiquidity: Invalid TRX amount in tx");
        } else {
            /// 这不是一个与 TRX 相关的流动性，直接尝试从 ERC20 中转账进来
            TransferHelper.safeTransferFrom(tokenA, msg.sender, address(this), amountA);
        }
        TransferHelper.safeTransferFrom(tokenB, msg.sender, address(this), amountB);
        
        /// 修改流动性记录表
        //liquidityMap[tokenA][msg.sender] = SafeMath.add96(liquidityMap[tokenA][msg.sender], amountA, "Overflowed");
        //liquidityMap[tokenB][msg.sender] = SafeMath.add96(liquidityMap[tokenB][msg.sender], amountB, "Overflowed");
        
        pairLiquidity[tokenA][tokenB].amountA = SafeMath.add(pairLiquidity[tokenA][tokenB].amountA, amountA);
        pairLiquidity[tokenA][tokenB].amountB = SafeMath.add(pairLiquidity[tokenA][tokenB].amountB, amountB);
        
        /// 发放 LP token
        uint256 mintAmount;
        uint lossPPT;
        (mintAmount, lossPPT) = calcMintLPTokenAmount(token1, amount1, token2, amount2);
        mintLPToken(tokenA, tokenB, msg.sender, mintAmount);
        
        require(lossPPT < maxLossPPT, "N1Swap::addLiquidity: lossPPT > maxLossPPT");
        
        emit afterAddLiquidity(pairLiquidity[tokenA][tokenB].amountA, pairLiquidity[tokenA][tokenB].amountB);
    }
    
    
    /**
     * 取回流动性
     * 传入交易对的代币的合约地址，顺序不分先后。
     */
    function removeLiquidity(address token1,  address token2, uint256 lpAmount) public {
        address tokenA;
        address tokenB;
        
        (tokenA, tokenB) = sortToken(token1, token2);
        
        uint256 LPBalanceBefore = LPTokenTable[tokenA][tokenB].balance[msg.sender];
        require(lpAmount <= LPBalanceBefore);
        
        // 计算可以提取多少流动性，以及可以获得多少手续费
        uint256 ratioPPT = lpAmount * 1e12 / LPTokenTable[tokenA][tokenB].amount;
        require(ratioPPT > 0, "N1Swap::removeLiquidity: input lpAmount too low");
        
        uint gotAmountA = pairLiquidity[tokenA][tokenB].amountA * ratioPPT / 1e12;
        uint gotAmountB = pairLiquidity[tokenA][tokenB].amountB * ratioPPT / 1e12;
        uint gotFeeAmountA = lpFeePool[tokenA] * ratioPPT / 1e12;
        uint gotFeeAmountB = lpFeePool[tokenB] * ratioPPT / 1e12;
        
        TNSTShare storage nstShare = mustGetNSTShare(tokenA, tokenB);
        uint nstAmount = (nstShare.mintedAmount.sub(nstShare.sentAmount)) * ratioPPT / 1e12;
        
        /// 修改流动性记录表
        
        uint liquidityAmountAAfter = SafeMath.sub(pairLiquidity[tokenA][tokenB].amountA, gotAmountA);
        uint liquidityAmountBAfter = SafeMath.sub(pairLiquidity[tokenA][tokenB].amountB, gotAmountB);
        pairLiquidity[tokenA][tokenB].amountA = liquidityAmountAAfter;
        pairLiquidity[tokenA][tokenB].amountB = liquidityAmountBAfter;
        
        /// 修改 LP balance 记录 
        
        //uint LPBalanceAfter = SafeMath.sub(LPTokenTable[tokenA][tokenB].balance[msg.sender], lpAmount);
        //LPTokenTable[tokenA][tokenB].balance[msg.sender] = LPBalanceAfter;
        uint tmpLpAmount = lpAmount;
        burnLPToken(tokenA, tokenB, msg.sender, tmpLpAmount);       /// ????? 不能直接在这里传入 lpAmount，否则会报 stack too deep 错误
        
        /// 修改手续费记录表
        lpFeePool[tokenA] = SafeMath.sub(lpFeePool[tokenA], gotFeeAmountA);
        lpFeePool[tokenB] = SafeMath.sub(lpFeePool[tokenB], gotFeeAmountB);
        
        /// 发钱和手续费，以及 NST
        /*
        TransferHelper.safeTransferAny(tokenA, msg.sender, gotAmountA);
        TransferHelper.safeTransferAny(tokenB, msg.sender, gotAmountB);
        TransferHelper.safeTransferAny(tokenA, msg.sender, gotFeeAmountA);
        TransferHelper.safeTransferAny(tokenB, msg.sender, gotFeeAmountB);
        */
        TransferHelper.safeTransferAny(tokenA, msg.sender, SafeMath.add(gotAmountA, gotFeeAmountA));
        TransferHelper.safeTransferAny(tokenB, msg.sender, SafeMath.add(gotAmountB, gotFeeAmountB));
        
        TransferHelper.safeTransferFrom(NSTAddress, address(this), msg.sender, nstAmount);
        
        emit removeLiquidityGotAmount(ratioPPT, gotAmountA, gotAmountB, gotFeeAmountA, gotFeeAmountB);
    }
    
    /**
     * @param tokenIn      存入的币种的合约地址
     * @param amountIn     存入金额
     * @param tokenOut     要获取的币种的合约地址
     * @param minPricePPT  最低容忍的价格，如果实际的 tokenOut 成交价格小于此价格，则抛出异常。单位：PPT，即万亿分之一，如果填入 3，则表示 1/1e12（万亿分之3），如果填入 10^12，则表示 1
     * @param deadline          交易必须在此时间之前完成，如果超过此时间，则交易失败。单位：秒级的 UNIX 时间戳
     */
    function swap(address tokenIn, uint96 amountIn, address tokenOut, uint minPricePPT, uint64 deadline) public payable {
        address pairA;
        address pairB;
        
        require(tokenIn != tokenOut, "N1Swap::swap: Invalid tokenIn and tokenOut pair");
        require(block.timestamp < deadline, "N1Swap::swap: Deadline excceded");
        
        (pairA, pairB) = sortToken(tokenIn, tokenOut);
        
        uint256 k;
        TPairAmount storage pairAmount = pairLiquidity[pairA][pairB];
        k = SafeMath.mul(pairAmount.amountA, pairAmount.amountB);
        
        uint256 amountInAfter;
        uint256 amountOutAfter;
        uint256 gotAmount;
        uint256 amountInBefore;
        uint256 amountOutBefore;
        
        
        if (tokenIn < tokenOut) {
            amountInBefore = pairAmount.amountA;
            amountOutBefore = pairAmount.amountB;
            amountInAfter = SafeMath.add(amountIn, pairAmount.amountA, "Overflowed");
            amountOutAfter = SafeMath.div(k, amountInAfter);
            gotAmount = SafeMath.sub(pairAmount.amountB, amountOutAfter);
        } else {
            amountInBefore = pairAmount.amountB;
            amountOutBefore = pairAmount.amountA;
            amountInAfter = SafeMath.add(amountIn, pairAmount.amountB);
            amountOutAfter = SafeMath.div(k, amountInAfter);
            gotAmount = SafeMath.sub(pairAmount.amountA, amountOutAfter);
        }
        
        _swapMustReceiveAmount(tokenIn, amountIn);
        
    
        require(gotAmount > 0, "N1Swap::swap: Insufficient liquidity fund");
        
        gotAmount = swapTakeFee(tokenOut, gotAmount);   /// 收取手续费
        
        emit onSwap(tokenIn, amountIn, tokenOut, amountInBefore, amountOutBefore, amountInAfter, amountOutAfter, gotAmount);
        
        /// 检查滑点是否符合要求（尚未实现）
        /// TODO: 添加检查滑点是否符合要求的代码
        uint afterPrice = amountInAfter * 1e12 / amountOutAfter; 
        require(afterPrice >= minPricePPT, "Deal price is lower than minPrice");
        
        /*
        uint96 afterPricePPM = SafeMath.safe96(amountInAfter * 1000 * 1000 / amountOutAfter, "");
        uint96 beforePricePPM = SafeMath.safe96(amountInBefore * 1000 * 1000 / amountOutBefore, "");
        uint96 slippagePPM = 0;
        if (afterPricePPM > 0) {
            slippagePPM = beforePricePPM / afterPricePPM;
        }
        
        //uint256 slippagePPM = amountInBefore * 1000 * 1000 / amountOutBefore - amountInAfter * 1000 * 1000 / amountOutAfter; 
emit onSlippagePPM(slippagePPM, maxSlippagePPM);

//        require(slippagePPM <= maxSlippagePPM, "maxSlippagePPM excceded");
*/        
        /// 更新资金池信息并转账
    
        if (tokenIn < tokenOut) {
            pairAmount.amountB = amountOutAfter;
            pairAmount.amountA = amountInAfter;
        } else {
            pairAmount.amountA = amountOutAfter;
            pairAmount.amountB = amountInAfter;
        }
      
        
        /*
        if (tokenIn < tokenOut) {
            pairLiquidity[pairA][pairB].amountB = amountOutAfter;
            pairLiquidity[pairA][pairB].amountA = amountInAfter;
        } else {
            pairLiquidity[pairA][pairB].amountA = amountOutAfter;
            pairLiquidity[pairA][pairB].amountB = amountInAfter;
        }
        */
        
        
         //changeAmountAB(tokenIn, tokenOut, amountOutAfter, amountInAfter);
        
        TransferHelper.safeTransferAny(tokenOut, msg.sender, gotAmount);
    }
    
    function changeAmountAB(address tokenIn, address tokenOut, uint amountOutAfter, uint amountInAfter) public {
        if (tokenIn < tokenOut) {
            writeB(tokenIn, tokenOut, amountOutAfter);
            writeA(tokenIn, tokenOut, amountInAfter);
        } else {
            writeA(tokenIn, tokenOut, amountOutAfter);
            writeB(tokenIn, tokenOut, amountInAfter);
        }
    }
    
    function _swapMustReceiveAmount(address tokenIn, uint amountIn) internal {
        if (tokenIn != address(0)) {
            TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this), amountIn);
        } else {
            require(msg.value >= amountIn, "Transfer in TRX not enough");
        }
    }
    
    /**
     * 对传入的交易信息，收取手续费，返回值为收取手续费后的用户可获得余额
     * 
     * @param gotAmount     收取手续费前用户可以获得的金额
     */
    function swapTakeFee(address tokenOut, uint256 gotAmount) public returns (uint256) {
        uint256 gotAmountAfterFee = gotAmount * 997 / 1000;
        uint256 fee = gotAmount - gotAmountAfterFee;
        
        emit onSwapTakeFee(tokenOut, gotAmount, fee);
        
        require(fee > 0, "N1Swap::swapTakeFee: Fee is lower than 0");
        
        lpFeePool[tokenOut] = SafeMath.add(lpFeePool[tokenOut], fee, "Overflowed");
        
        return gotAmountAfterFee;
    }
    
    

    
    /**
     * 返回一个交易对池子的资金情况
     * @param token1    币种 1 的合约地址
     * @param token2    币种 2 的合约地址，两个参数不区分先后顺序
     */
    function getLiquidity(address token1, address token2) public view returns (uint256 token1Amount, uint256 token2Amount) {
        require(token1 != token2, "Invalid token pair");
        
        if (token1 < token2) {
            token1Amount = pairLiquidity[token1][token2].amountA;
            token2Amount = pairLiquidity[token1][token2].amountB;
        } else {
            token1Amount = pairLiquidity[token2][token1].amountB;
            token2Amount = pairLiquidity[token2][token1].amountA;
        }
    }
    
    function sortToken(address tokenIn, address tokenOut) public pure returns  (address, address) {
        if (tokenIn < tokenOut) {
            return ( tokenIn, tokenOut);
        } else {
            return (tokenOut, tokenIn);
        }
    }
    
    
    function mustGetNSTShare(address token1, address token2) internal returns (TNSTShare storage){
        address tokenA;
        address tokenB;
        (tokenA, tokenB) = sortToken(token1, token2);
        
        TNSTShare storage share = NSTMintTable[tokenA][tokenB];
        if (share.lastMintTime == 0) {
            share.lastMintTime = block.timestamp;
        } else {
            uint elapsed = SafeMath.sub(block.timestamp, share.lastMintTime);
            if (elapsed > 0) {
                uint minted = share.amountPerDay * elapsed / 86400;
                share.mintedAmount = SafeMath.add(share.mintedAmount, minted);
                share.lastMintTime = block.timestamp;
            }
        }
        
        return share;
    }
    
    function getNSTShare(address token1, address token2) public view returns (uint mintedAmount, uint sentAmount, uint lastMintTime, uint amountPerDay) {
        address tokenA;
        address tokenB;
        (tokenA, tokenB) = sortToken(token1, token2);
        
        TNSTShare storage share = NSTMintTable[tokenA][tokenB];
        
        return (share.mintedAmount, share.sentAmount, share.lastMintTime, share.amountPerDay);
    }
    
    function setNSTShareAmountPerDay(address token1, address token2, uint amountPerDay) public {
        TNSTShare storage share = mustGetNSTShare(token1, token2);
        share.amountPerDay = amountPerDay;
    }
    
    /**
     * If there is a need to upgrade contract, we have to transfer funds to new contract manually
     */
    function upgrade(address token, address payable to, uint amount) public onlyFactory {
        if (token == address(0)) {
            to.transfer(amount);
        } else {
            //require(ITRC20(token).transfer(to, amount), "N1Swap::upgrade: TRC20 transfer failed");
            TransferHelper.safeTransfer(token, to, amount);
        }
    }
    
    modifier onlyFactory() {
        require(msg.sender == factory, "N1Swap::upgrade: No priv");
        _;
    }
}



library TransferHelper {
    function safeApprove(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: APPROVE_FAILED');
    }

    function safeTransfer(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }

    function safeTransferFrom(address token, address from, address to, uint value) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FROM_FAILED');
    }
    
    function safeTransferAny(address token, address to, uint value) internal {
        if (token == address(0)) {
            msg.sender.transfer(value);
        } else {
            safeTransfer(token, to, value);
        }
    }

}
