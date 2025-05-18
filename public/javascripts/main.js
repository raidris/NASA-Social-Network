/**
 * wrapped func
 */
(function () {

  /** globals and imports of elements and ids */
  const NASA_API = "INSERT API KEY HERE"
  let startDate
  const date = document.getElementById("dateInput")
  const submitDateButton = document.getElementById("submitDateBtn")
  const feed = document.getElementById("postsDiv")
  const moreButton = document.getElementById("moreBtn")
  const gif = document.getElementById("loadingGif")


  document.addEventListener("DOMContentLoaded", function () {
    feed.addEventListener("click", clickHandler)
    submitDateButton.addEventListener("click", nasaApiHandler)
    moreButton.addEventListener("click", fetchMoreHandler)
  })

  configDate()
  setInterval(getAllComments, 15000)  // polling call every 15 seconds

  /**
   * show/hide toggle
   * @param tag is the tag that we want to show/hide
   * @param status: 1 is show, 0 is hide
   */
  function toggleShowById(tag, status) {
    if (status) tag.classList.remove("d-none")
    else tag.classList.add("d-none")
  }

  /**
   * this func calculates today's date
   */
  function configDate() {

    date.value = date.max = new Date().toLocaleDateString("en-ca")
    fetchDataFromNasa(date.value).then(() => getAllComments())
  }

  /**
   * this func handles every fetch to our api while there is a session underway.
   * otherwise it will redirect the user to the login page.
   * it handles the errors coming from the server accordingly.
   * @param url is the path to a route
   * @param content is the details of the fetch
   * @returns a json containing the desired content
   */
  async function fetchMyApi(url, content) {
    const session = await fetch(`/feed/session`);
    if (session.status === 200) {
      const res = content !== undefined ? await fetch(url, content) : await fetch(url)
      if (res.status !== 200)
        throw new Error(`${await res.json()}`)
      return await res.json()
    } else if (session.status === 403)
      window.location.href = '/'
  }

  /**
   * this func retrieves all the comments
   */
  function getAllComments() {
    let allCommentSection = document.querySelectorAll('[name = "comment-section"]')
    allCommentSection.forEach(commentSection => commentSection.innerHTML = '')
    getCommentsOfCurrPosts()
  }

  /**
   * this function retrieves all comments of current showing posts
   */
  function getCommentsOfCurrPosts() {
    let currIds = []
    let currPosts = document.querySelectorAll('[name = "post"]')
    currPosts.forEach(item => currIds.push(item.getAttribute('id').split(" ")[1]))

    currIds.forEach(id => getComments(id))
  }

  /**
   * this func handles a click on the posts grid
   * @param event
   */
  function clickHandler(event) {
    event.preventDefault()

    let id = event.target.getAttribute('id')

    if (id !== null) {
      let temp = id.split(" ")[0]

      if (temp === 'comment-submit')
        addCommentHandler(event)
      else if (temp === 'del-btn')
        delCommentHandler(event)
    }
  }

  /**
   * this func handles the "delete comment" functionality
   * @param event
   */
  function delCommentHandler(event) {
    event.preventDefault()

    let selectedCommentId = event.target.getAttribute('id').split(" ")[3]
    let currPostDate = event.target.getAttribute('id').split(" ")[4]

    let currCommentSection = document.getElementById(`comment-section ${currPostDate}`)

    fetchMyApi(`/feed/${selectedCommentId}`, {
      method: "DELETE"
    }).then(function (res) {
      if (res) {
        currCommentSection.innerHTML = ''
        getComments(currPostDate)
      }
    }).catch(function (error) {
      console.log(error)
    }).finally(function () {
      document.getElementById(`comment-input ${currPostDate}`).value = ''
    })
  }

  /**
   * this func handles the "add comment" functionality
   * @param event
   */
  function addCommentHandler(event) {
    event.preventDefault()

    let currFormId = event.target.getAttribute('id').split(" ")[1]
    let currCommentSection = document.getElementById(`comment-section ${currFormId}`)

    fetchMyApi("/feed/comment", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        'comment': document.getElementById(`comment-input ${currFormId}`).value,
        'postId': currFormId
      })
    }).then(function (res) {
      if (res) {
        currCommentSection.innerHTML = ''
        getComments(currFormId)
      }
    }).catch(function (error) {
      document.getElementById(`comment-input ${currFormId}`).setCustomValidity(`${error}`)
      document.getElementById(`comment-input ${currFormId}`).reportValidity(`${error}`)
      console.log(`${error}`)
    }).finally(function () {
      document.getElementById(`comment-input ${currFormId}`).value = ''
    })

  }

  /**
   * this func retrieves a comment of our api
   * @param id is the date of the current image (post)
   */
  function getComments(id) {
    fetchMyApi(`/feed/${id}`)
        .then(function (res) {
          if (res) {
            res.comments.forEach(comment => {
              addComment(id, comment, res.currUser)
            })
          }
        }).catch(function (error) {
      console.log(error)
    })
  }

  /**
   * this func builds a comment and adds it to the comment section
   * @param id is the date of the current image (post)
   * @param comment is the comment object that must be added to the comment section
   * @param currUser is the id (email address) user the is currently connected to the session
   */
  function addComment(id, comment, currUser) {

    let newComment = document.createElement('li')
    newComment.setAttribute('id', `comment ${comment.author} ${comment.id} ${id}`)
    newComment.setAttribute('class', 'row')

    if (comment.author === currUser) {
      let newDeleteBtn = document.createElement('button')
      newDeleteBtn.setAttribute('id', `del-btn ${comment.author} ${comment.id} ${id}`)
      newDeleteBtn.setAttribute('class', 'button col-5')

      let span = document.createElement('span')
      span.setAttribute('id', `del-btn ${comment.author} ${comment.id} ${id}`)
      span.innerHTML = "Delete"

      newDeleteBtn.append(span)
      newComment.appendChild(newDeleteBtn)
    }

    let newString = document.createElement('div')
    newString.setAttribute('class', 'col-7')
    newString.innerHTML = `${comment.author}: ${comment.str}`

    newComment.appendChild(newString)

    document.getElementById(`comment-section ${id}`).appendChild(newComment)
  }

  /**
   * this function creates the feed grid
   * @param data are the objects received from nasa's API that will be used to create the posts
   */
  function createPostsGrid(data) {

    data.slice().reverse().forEach(obj => {
      let newPost = document.createElement("div")
      newPost.setAttribute("id", `post ${obj.date}`)
      newPost.setAttribute('class', 'row rounded-3')
      newPost.setAttribute('name', 'post')
      newPost.setAttribute('style', 'background-color: #ADD8E6')

      let newMediaDiv = document.createElement('div')
      newMediaDiv.setAttribute('class', 'col-6 d-flex aligns-items-center justify-content-center')
      newMediaDiv.setAttribute('style', "height: 500px;")

      let mediaTag
      if (obj.media_type === 'image') mediaTag = 'img'
      else mediaTag = 'iframe'

      let newMedia = document.createElement(mediaTag)
      newMedia.setAttribute("src", obj.url)
      newMedia.setAttribute("alt", obj.title)
      newMedia.setAttribute('class', 'img-fluid')

      newMediaDiv.appendChild(newMedia)
      newPost.appendChild(newMediaDiv)

      let newInfo = document.createElement("div")
      newInfo.setAttribute('class', "col-6 overflow-auto")
      newInfo.setAttribute('style', "height: 500px;")

      let newDetails = document.createElement("div")
      newDetails.setAttribute('class', "row rounded-3 overflow-auto bg-light m-auto")
      newDetails.setAttribute('style', "height: 150px;")

      let commentSection = document.createElement("ul")
      commentSection.setAttribute('id', `comment-section ${obj.date}`)
      commentSection.setAttribute('name', 'comment-section')
      commentSection.setAttribute('class', "row rounded-3 overflow-auto bg-light m-auto")
      commentSection.setAttribute('style', "height: 150px;")

      let commentBox = document.createElement('form')
      commentBox.setAttribute('action', '/feed/comment')
      commentBox.setAttribute('method', 'post')
      commentBox.setAttribute('id', `comment-box ${obj.date}`)
      commentBox.setAttribute('class', 'comment-box')

      let commentFormLabel = document.createElement('label')
      commentFormLabel.setAttribute('for', 'comment')
      commentFormLabel.setAttribute('class', 'form-label')
      commentFormLabel.innerHTML = 'Add a comment:'

      let commentInput = document.createElement('input')
      commentInput.setAttribute('type', 'textarea')
      commentInput.setAttribute('id', `comment-input ${obj.date}`)
      commentInput.setAttribute('name', `comment-input`)

      let commentSubmit = document.createElement('input')
      commentSubmit.setAttribute('id', `comment-submit ${obj.date}`)
      commentSubmit.setAttribute('type', 'submit')
      commentSubmit.setAttribute('class', 'btn btn-primary')
      commentSubmit.setAttribute('name', 'submit-comment')

      commentBox.appendChild(commentFormLabel)
      commentBox.appendChild(commentInput)
      commentBox.appendChild(commentSubmit)

      if (obj.hasOwnProperty('date')) {
        let newDate = document.createElement("p")
        newDate.innerHTML = `Date: ${obj.date}`
        newDetails.appendChild(newDate)
      }

      if (obj.hasOwnProperty('title')) {
        let newTitle = document.createElement("p")
        newTitle.innerHTML = `Caption: ${obj.title}`
        newDetails.appendChild(newTitle)
      }

      if (obj.hasOwnProperty('explanation')) {
        let newExplanation = document.createElement("p")
        newExplanation.innerHTML = `Explanation: ${obj.explanation}`
        newDetails.appendChild(newExplanation)
      }

      if (obj.hasOwnProperty('copyright')) {
        let newPoster = document.createElement("p")
        newPoster.innerHTML = `Taken by: ${obj.copyright}`
        newDetails.appendChild(newPoster)
      }

      newInfo.appendChild(document.createElement('br'))
      newInfo.appendChild(newDetails)
      newInfo.appendChild(document.createElement('br'))
      newInfo.appendChild(commentBox)
      newInfo.appendChild(document.createElement('br'))
      newInfo.appendChild(commentSection)
      newInfo.appendChild(document.createElement('br'))

      newPost.appendChild(newInfo)

      feed.appendChild(newPost)
      feed.appendChild(document.createElement('br'))
    })
  }

  /**
   * this func calculates a date X days before a date
   * @param numOfDays is the number of previous days of images to fetch from the given date
   * @param date is the date of the image to fetch from
   * @returns {Date} is the returned value
   */
  function getDateXDaysAgo(numOfDays, date = new Date()) {
    const daysAgo = new Date(date.getTime());
    daysAgo.setDate(date.getDate() - numOfDays);

    return daysAgo;
  }

  /**
   * this func handles nasa's api
   * @param event
   * @returns {Promise<void>}
   */
  async function nasaApiHandler(event) {
    event.preventDefault()
    feed.innerHTML = ""
    await fetchDataFromNasa(date.value)
    getAllComments()
  }

  /**
   * this func fetches data from nasa's api
   * @param date is the input date that will be used to fetch the images
   * @returns {Promise<void>}
   */
  async function fetchDataFromNasa(date) {
    startDate = getDateXDaysAgo(2, new Date(date)).toLocaleDateString("en-ca")
    let url = NASA_API + '&start_date=' + `${startDate}` + '&end_date=' + `${date}`

    toggleShowById(gif, 1)

    await fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.hasOwnProperty('code')) {
            if (400 <= json.code && json.code <= 499)
              throw new Error(json.msg)
          } else
            createPostsGrid(json)
        })
        .catch(function (error) {
          feed.innerHTML = error
        })

    toggleShowById(gif, 1)
    toggleShowById(feed, 1)
    toggleShowById(gif, 0)
  }

  /**
   * this func handles the "more" button functionality
   * @param event
   * @returns {Promise<void>}
   */
  async function fetchMoreHandler(event) {
    event.preventDefault()
    await fetchDataFromNasa(getDateXDaysAgo(1, new Date(startDate)).toLocaleDateString("en-ca"))
    getAllComments()
  }
})()