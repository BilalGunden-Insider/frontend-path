export async function fetchMovies(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()

        return data.results
    } catch (error) {
        console.error('Fetch error handling:', error)
    }
}