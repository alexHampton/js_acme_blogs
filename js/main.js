const createElemWithText = (element = 'p', text = '', className = '') => {
    const elemWithText = document.createElement(element);
    elemWithText.textContent = text;
    elemWithText.className = className;
    return elemWithText;
}

const getUsers = async () => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await resp.json();
    console.log(users);
    return users;
} 

let myUsers = [
    { id: 1, name: "Leanne Graham", username: 'Bret', email: "anything@anywhere.com"},
    { id: 2, name: "Bill Masters", username: "Bob", email: "another"},
    { id: 3, name: "Joe Namath", username: "Not Joe", email: "the other joe"}
]

// creates option elements for all users in usersJSON
const createSelectOptions =  (usersJSON) => {
    if (!usersJSON) return undefined

    let options = usersJSON.map( user => {
        let optionElement = document.createElement("option")
        optionElement.value = user.id
        optionElement.textContent = user.name
        return optionElement
    })
    return options
}

// receives a postId and toggles the comment section of that id.
// returns the section
const toggleCommentSection = (postId) => {
    if (!postId) return undefined

    const idSections = document.getElementsByTagName('section')
    const idSection = Array.from(idSections).filter((section) => {
        return section.attributes["data-post-id"].value == postId
    })[0]
    if (!idSection) return null
    idSection.classList.toggle('hide')
    return idSection
}

const toggleCommentButton = (postId) => {
    if (!postId) return undefined

    let buttons = document.getElementsByTagName('button')
    buttons = Array.from(buttons).filter((btn) => {
        return btn.attributes.hasOwnProperty('data-post-id');
    })
    
    if (buttons.length == 0) return null
    const button = Array.from(buttons).filter((btn) => {
        return btn.attributes["data-post-id"].value == postId
    })[0]
    if (!button) return null

    button.textContent = (button.textContent == "Show Comments") ? "Hide Comments" : "Show Comments"
    return button
}

toggleCommentButton(1)