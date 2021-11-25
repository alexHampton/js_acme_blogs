const createElemWithText = (element = 'p', text = '', className = '') => {
    const elemWithText = document.createElement(element);
    elemWithText.textContent = text;
    elemWithText.className = className;
    return elemWithText;
}


// let myUsers = [
//     { id: 1, name: "Leanne Graham", username: 'Bret', email: "anything@anywhere.com"},
//     { id: 2, name: "Bill Masters", username: "Bob", email: "another"},
//     { id: 3, name: "Joe Namath", username: "Not Joe", email: "the other joe"}
// ]

// creates option elements for all users in usersJSON
const createSelectOptions =  (usersJSON) => {
    if (!usersJSON) return

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
    if (!postId) return

    const idSections = document.getElementsByTagName('section')
    const idSection = Array.from(idSections).filter((section) => {
        return section.attributes["data-post-id"].value == postId
    })[0]
    if (!idSection) return null
    idSection.classList.toggle('hide')
    return idSection
}

const toggleCommentButton = (postId) => {
    if (!postId) return

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


// recap: I first started making async functions but didn't need to.
// It only made things more complicated. I have learned to start basic and 
// slowly make it as complex as it needs to be. 

// I was having difficulty checking the 'data-post-id' attributes, so I logged
// my objects to the console so I could inspect them. I also realized that since
// some objects did not have that property, I had to check if the property exists
// first.

const deleteChildElements = (parent) => {
    if (!(parent instanceof HTMLElement)) return
    let child = parent.lastElementChild
    while (child) {
        parent.removeChild(child)
        child = parent.lastElementChild
    }
    return parent
}

// test function for now
const toggleComments = (event, id) => {

}

const addButtonListeners = () => {
    const buttons = document.querySelectorAll('main button')
    buttons.forEach((btn) => {
        let postId = btn.dataset.postId
        btn.addEventListener('click', (event) => {
            toggleComments(event, postId)
        })
    })
    return buttons
}

const removeButtonListeners = () => {
    const buttons = document.querySelectorAll('main button')
    buttons.forEach(btn => {
        //let postId = btn.dataset.postId
        btn.removeEventListener('click', addButtonListeners)

    })
    return buttons
}

const createComments = (jsonComments) => {
    if (!jsonComments) return
    const fragment = document.createDocumentFragment()
    jsonComments.forEach((comment) => {
        let article = document.createElement('article')
        let h3 = createElemWithText('h3', comment.name)
        let p = createElemWithText('p', comment.body)
        let pEmail = createElemWithText('p', `From: ${comment.email}`)
        article.appendChild(h3)
        article.appendChild(p)
        article.appendChild(pEmail)
        fragment.appendChild(article)
    })
    return fragment
}

const populateSelectMenu = (jsonUsers) => {
    if (!jsonUsers) return
    const menu = document.getElementById('selectMenu')
    const options = createSelectOptions(jsonUsers)
    options.forEach(option => menu.appendChild(option))
    return menu
}

const getUsers = async () => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await resp.json();
    return users;
}

const getUserPosts = async (postId) => {
    if (!postId) return
    try {
        const resp = await fetch(`https://jsonplaceholder.typicode.com/posts/?userId=${postId}`)
        const posts = await resp.json()
        return posts
    } catch (err) {
        console.log(err)
    }   
}

const getUser = async (userId) => {
    if (!userId) return
    const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    const user = await resp.json()
    return user
}

const getPostComments = async (postId) => {
    if (!postId) return
    const resp = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    const comments = await resp.json()
    return comments
}
