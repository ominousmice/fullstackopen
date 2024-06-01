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
  
module.exports = {
    dummy,
    totalLikes
}