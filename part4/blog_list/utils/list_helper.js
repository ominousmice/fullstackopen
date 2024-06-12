const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(eachBlog => eachBlog.likes)
    
    const sum = likes.reduce((sum, likes) => {
        return sum + likes
    }, 0)
    
    return sum
}

const favoriteBlog = (blogs) => {
    //console.log('new call to function')

    if (blogs.length === 0){
        return []
    }

    let max_index = 0

    /*
    // One way to do it, using a for loop
    let max = blogs[0].likes
    for (let i = 0; i < blogs.length; i++){
        //console.log('i: ', i, ' max_index: ', max_index)
        //console.log('max: ', max, ' blogs[i].likes: ', blogs[i].likes)
        if (blogs[i].likes > max){
            //console.log('updated max')
            max = blogs[i].likes
            max_index = i
        }
        //console.log('next iteration')
    }
    */

    // Another way to do it, using reduce
    const blogLikes = blogs.map(eachBlog => eachBlog.likes)

    const max = blogLikes.reduce((maxLikes, currentLikes, currentIndex) => {
        // If the max value is updated, change the maxIndex
        if (Math.max(maxLikes, currentLikes) != maxLikes){
            max_index = currentIndex
        }
        return Math.max(maxLikes, currentLikes)
    }, 0)

    const title = blogs[max_index].title
    const author = blogs[max_index].author
    const likes = blogs[max_index].likes

    return { title, author, likes }
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}