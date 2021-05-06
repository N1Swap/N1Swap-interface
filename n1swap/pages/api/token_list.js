// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.status(200).json({
    'status' : 'success',
    'data'   : [
        {
            'name'             : 'trx',
            'contract_address' : 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
            'icon'             : 'trx.svg',
            'type'             : 'trc10',
            'decimal'          : 6,
        },
        {
            'name'             : 'wbtt',
            'contract_address' : 'TF5Bn4cJCT6GVeUgyCN4rBhDg42KBrpAjg',
            'icon'             : 'btt.svg',
            'type'             : 'trc20',
            'decimal'          : 6,
        },
        {
            'name'             : 'usdt',
            'contract_address' : 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            'sub'              : 'the usdt of trx',
            'icon'             : 'usdt.svg',
            'type'             : 'trc20',
            'decimal'          : 6,
        },
        {
            'name'             : 'NST',
            'contract_address' : 'TYuUHP9v2ye3LMwGQP7YZhqRxbHiCLXFJy',
            'sub'              : 'n1swap',
            'icon'             : 'nst.svg',
            'type'             : 'trc20',
            'decimal'          : 6,
        }
    ]

  })
}
