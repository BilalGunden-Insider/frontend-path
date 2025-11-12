<script setup>
import { ref, defineEmits } from 'vue';
import lodash from 'lodash';
const { debounce } = lodash;

const emits = defineEmits(['update-search']);
const searchTerm = ref('');
const isInputFocused = ref(false);
const emitSearchTerm = debounce((term) =>{
  emits('update-search', term);
}, 500);

const updateSearchTerm = (event) => {
  searchTerm.value = event.target.value;

  if (searchTerm.value.length >= 3) {
    emitSearchTerm(searchTerm.value);
  } else if (searchTerm.value.length === 0) {
    emitSearchTerm('');
  }
}
</script>

<template>
  <section class="relative bg-cover bg-center text-white min-h-[500px] w-full overflow-hidden" 
           style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(/icon/mainHero.jpg);">
    
    <div class="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/70"></div>
    
    <div class="relative z-10 flex flex-col items-center justify-center min-h-[500px] px-4 py-12">
      <div class="w-full max-w-4xl mx-auto">
        
        <div class="text-center mb-12">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            Welcome.
          </h1>
          <p class="text-xl md:text-2xl text-gray-200 mb-2 font-light">
            Discover millions of movies, TV shows and people
          </p>
          <p class="text-lg md:text-xl text-gray-300 font-light">
            Explore the world of entertainment
          </p>
        </div>

        <div class="w-full max-w-2xl mx-auto">
          <div class="flex w-full bg-white rounded-full overflow-hidden shadow" :class="{ 'gradient-border': isInputFocused }">
            <input 
              @input="updateSearchTerm" 
              @focus="isInputFocused = true" 
              @blur="isInputFocused = false"
              v-model="searchTerm" 
              type="text" 
              class="flex-grow px-5 py-2 text-gray-700 outline-none w-full h-12" 
              placeholder="Search for a movie, tv show, person..." 
            />
            <button class="bg-gradient-to-r from-[#1ed5a9] to-[#01b4e4] w-28 rounded-full h-[3rem] m-auto">Search</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gradient-border {
  box-shadow: 0 0 0 2px #1ed5a9, 0 0 0 4px #01b4e4;
}

* {
  transition: all 0.2s ease-in-out;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@media (max-width: 640px) {
  .text-5xl {
    font-size: 3rem;
  }
  
  .text-6xl {
    font-size: 3.5rem;
  }
}
</style>