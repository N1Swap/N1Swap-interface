import React, { Component,useContext } from 'react';
import Text from 'helper/translate/text'
import translateContext from 'helper/translate/context'

export function t(word) {
    return <Text>{word}</Text>
}

export function text(word) {
    const translate = useContext(translateContext);
    return translate.localeMessage[word] ? translate.localeMessage[word] : word;
}