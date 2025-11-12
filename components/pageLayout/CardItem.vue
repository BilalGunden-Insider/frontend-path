<script setup>
import { useStore } from '~/stores/store.js'
import { computed, onMounted } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const store = useStore()
const router = useRouter()

const isFavorite = computed(() => store.isFavorite(props.movie))

const toggleFavorite = (event) => {
  event.stopPropagation()
  store.toggleFavorite(props.movie)
}

onMounted(() => {
  store.initializeFavorites()
})

const navigateToMovieDetail = () => {
  router.push({
    path: `/movie/${props.movie.id}`,
    query: {
      movie: JSON.stringify(props.movie)
    }
  })
}

const getPosterImageUrl = () => {
  return `https://image.tmdb.org/t/p/w220_and_h330_face/${props.movie.poster_path}`
}

const getVoteScoreColor = () => {
  const vote = props.movie.vote_average
  if (vote < 2) return '#db2360'
  if (vote < 7) return '#d3d631'
  return '#20c774'
}

const formatReleaseDate = () => {
  return props.movie.release_date
}
</script>

<template>
  <div 
    class="w-44 mt-6 p-2 relative cursor-pointer group" 
    @click="navigateToMovieDetail"
  >
    <div class="relative">
      <img 
        class="w-full h-auto rounded-xl mb-4 object-cover transition-transform group-hover:scale-105" 
        :src="getPosterImageUrl()" 
        :alt="`Poster of ${movie.title}`" 
        loading="lazy"
      />
      
      <div 
        class="flex justify-center items-center w-10 h-10 absolute p-2 rounded-full border-4 z-10 top-56 left-5 leading-none text-center text-xs font-bold text-white bg-[#081c21]" 
        :style="{ borderColor: getVoteScoreColor() }"
      >
        {{ movie.vote_average.toFixed(1) }}
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="text-left text-lg font-semibold text-gray-800 line-clamp-2">
        {{ movie.title }}
      </h3>
      <p class="text-left text-sm text-gray-500">
        {{ formatReleaseDate() }}
      </p>
    </div>

    
    <button 
      @click="toggleFavorite" 
      class="absolute top-[-30px] right-1 flex items-center justify-center mt-4 mx-auto w-10 h-10 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
      :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
    >
      <i 
        :class="isFavorite ? 'pi pi-star text-yellow-500' : 'pi pi-star text-gray-400'" 
        class="text-xl"
      ></i>
    </button>
  </div>
</template>