const createElemWithText = (element = 'p', text = '', className = '') => {
    const elemWithText = document.createElement(element);
    elemWithText.textContent = text;
    elemWithText.className = className;
    return elemWithText;
}

