// recap: I first started making async functions but didn't need to.
// It only made things more complicated. I have learned to start basic and 
// slowly make it as complex as it needs to be. 

// I was having difficulty checking the 'data-post-id' attributes, so I logged
// my objects to the console so I could inspect them. I also realized that since
// some objects did not have that property, I had to check if the property exists
// first.

// recap: need to review removeEventListener. 

// recap: all async json functions are pretty straighforward. didn't have any problems with them.

// recap: DO NOT use Array.forEach() in async functions!

// final recap:
// it was a good practice, but since it was just step by step,
// I didn't feel like I was making the program until suddenly at the end it all came together.
// I would have liked to have a top-down approach first, so we could see how each function 
// was going to be needed.

const createElemWithText = (element = 'p', text = '', className = '') => {
    const elemWithText = document.createElement(element);
    elemWithText.textContent = text;
    elemWithText.className = className;
    return elemWithText;
}

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

// toggles button to 'show comments' or 'hide comments'
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

// remove all child elements. 
// is used when refreshing the page
const deleteChildElements = (parent) => {
    if (!(parent instanceof HTMLElement)) return
    let child = parent.lastElementChild
    while (child) {
        parent.removeChild(child)
        child = parent.lastElementChild
    }
    return parent
}

// all buttons on page will toggle comments
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

// is used when refreshing the page
const removeButtonListeners = () => {
    const buttons = document.querySelectorAll('main button')
    buttons.forEach(btn => {
        btn.removeEventListener('click', addButtonListeners)

    })
    return buttons
}

// returns a  document fragment with comment information
// used when displaying comments (displayComments())
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

// each user in jsonUsers becomes an option in the selectMenu
const populateSelectMenu = (jsonUsers) => {
    if (!jsonUsers) return
    const menu = document.getElementById('selectMenu')
    const options = createSelectOptions(jsonUsers)
    options.forEach(option => menu.appendChild(option))
    return menu
}

// returns all users
const getUsers = async () => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await resp.json();
    return users;
}

// returns all posts belonging to the userId
const getUserPosts = async (userId) => {
    if (!userId) return
    try {
        const resp = await fetch(`https://jsonplaceholder.typicode.com/posts/?userId=${userId}`)
        const posts = await resp.json()
        return posts
    } catch (err) {
        console.log(err)
    }   
}

// returns the user with userId
const getUser = async (userId) => {
    if (!userId) return
    const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    const user = await resp.json()
    return user
}

// returns all comments belonging to the postId
const getPostComments = async (postId) => {
    if (!postId) return
    const resp = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    const comments = await resp.json()
    return comments
}

// takes in postId
// gets the comments to the post and returns them as a <section>
const displayComments = async (postId) => {
    if (!postId) return
    const section = document.createElement('section')
    section.dataset.postId = postId
    section.classList.add('comments', 'hide')
    const comments = await getPostComments(postId)
    const fragment = createComments(comments)
    section.appendChild(fragment)
    return section
}

// returns a fragment of all posts related to the user 
// who was chosen from the select menu
const createPosts = async (jsonPosts) => {
    if (!jsonPosts) return
    const fragment = document.createDocumentFragment()
    for (const post of jsonPosts) {
        const article = document.createElement('article')
        const h2 = createElemWithText('h2', post.title)
        const p = createElemWithText('p', post.body)
        const pID = createElemWithText('p', `Post ID: ${post.id}`)
        const author = await getUser(post.userId)
        const pAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`)
        const pCatchPhrase = createElemWithText('p', `${author.company.catchPhrase}`)
        const button = createElemWithText('button', "Show Comments")
        button.dataset.postId = post.id
        article.appendChild(h2)
        article.appendChild(p)
        article.appendChild(pID)
        article.appendChild(pAuthor)
        article.appendChild(pCatchPhrase)
        article.appendChild(button)

        let section = await displayComments(post.id)
        article.appendChild(section)

        fragment.appendChild(article)
    }
    return fragment
}

// returns an element containing all posts related to the employee
// chosen from the select menu
const displayPosts = async (posts) => {
    const main = document.getElementsByTagName('main')[0]
    const element = (posts) ? await createPosts(posts) 
        : createElemWithText('p', "Select an Employee to display their posts.", "default-text")

    main.appendChild(element)
    return element
}


const toggleComments = (event, postId) => {
    if (!event || !postId) return
    event.target.listener = true
    const section = toggleCommentSection(postId)
    const button = toggleCommentButton(postId)
    return [section, button]
}

// refreshes posts after user chooses from the select menu
const refreshPosts = async (jsonPosts) => {
    if (!jsonPosts) return
    const removeButtons = removeButtonListeners()
    const main = deleteChildElements(document.getElementsByTagName('main')[0])
    const fragment = await displayPosts(jsonPosts)
    const addButtons = addButtonListeners()
    return [removeButtons, main, fragment, addButtons]
}

// fires when an option from the select menu is chosen
const selectMenuChangeEventHandler = async (event) => {
    let userId = (event) ? event.target.value : 1
    const posts = await getUserPosts(userId)
    const refreshPostsArray = await refreshPosts(posts)
    return [userId, posts, refreshPostsArray]
}

// gets the users and populates the select menu
const initPage = async () => {
    const users = await getUsers()
    const select = populateSelectMenu(users)
    return [users, select]
}

// 21.
const initApp = async () => {
    initPage()
    const menu = document.getElementById('selectMenu')
    menu.addEventListener('change', (event) => {
        selectMenuChangeEventHandler(event)
    })
}

initApp()