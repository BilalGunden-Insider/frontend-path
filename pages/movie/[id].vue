<script>
import MovieContentView from '../../components/pageLayout/movieDetail.vue';
import { useStore } from '../../stores/store.js';

export default {
  components: {
    MovieContentView
  },
  data() {
    const store = useStore();
    const route = useRoute();
    const isFavorite = computed(() => store.isFavorite(movie));
    const movie = route.query.movie ? JSON.parse(route.query.movie) : {};

    console.log(movie)

    const toggleFavorite = () => {
      store.toggleFavorite(movie);
    };

    return {
      movie: {},
      actors: [],
      cast: [],
      crew: [],
      reviews: [],
      discussions: [],
      activeTab: 'reviews',
      activeMediaTab: 'popular',
      videos: [],
      backdrops: [],
      posters: [],
      keywords: [],
      toggleFavorite,
      isFavorite
    };
  },
  created() {
    const route = useRoute();
    const movieData = route.query.movie ? JSON.parse(route.query.movie) : {};

    this.movie = movieData;
    this.actors = movieData.actors || [];
    
    if (movieData.id) {
      this.fetchCast(movieData.id);
      this.fetchReviews(movieData.id);
      this.fetchMedia(movieData.id);
      this.fetchMovieDetails(movieData.id);
      this.fetchKeywords(movieData.id);
      
    }
  },
  computed: {
    formattedVoteAverage() {
      return this.movie.vote_average?.toFixed(1);
    },
    voteBorderColor() {
      const vote = this.movie.vote_average;
      if (vote < 2) return '#db2360';
      if (vote < 7) return '#d3d631';
      return '#20c774';
    },
    directors() {
      return this.crew.filter(person => person.job === 'Director');
    },
    writers() {
      return this.crew.filter(person => 
        person.job === 'Screenplay' || 
        person.job === 'Writer' || 
        person.job === 'Story' ||
        person.department === 'Writing'
      );
    },
    mainCast() {
      return this.cast.slice(0, 3);
    },
    firstTrailer() {
      return this.videos.find(video => 
        video.type === 'Trailer' || 
        video.name?.toLowerCase().includes('trailer')
      ) || this.videos[0];
    }
  },
  methods: {
    getImageUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },
    getProfileImageUrl(path) {
      if (!path) return null;
      return `https://image.tmdb.org/t/p/w138_and_h175_face${path}`;
    },
    async fetchCast(movieId) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=348088421ad3fb3a9d6e56bb6a9a8f80&language=en-US`
        );
        const data = await response.json();
        this.cast = data.cast || [];
        this.crew = data.crew || [];
      } catch (error) {
        console.error('Error fetching cast:', error);
        this.cast = [];
        this.crew = [];
      }
    },
    getCharacterName(castMember) {
      if (castMember.roles && castMember.roles.length > 0) {
        return castMember.roles[0].character;
      }
      return castMember.character || '';
    },
    async fetchReviews(movieId) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=348088421ad3fb3a9d6e56bb6a9a8f80&language=en-US&page=1`
        );
        const data = await response.json();
        this.reviews = data.results || [];
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.reviews = [];
      }
    },
    getAvatarUrl(path) {
      if (!path || path === null || path === '') return null;
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      const avatarPath = path.startsWith('/') ? path : `/${path}`;
      return `https://image.tmdb.org/t/p/w45${avatarPath}`;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    truncateContent(content, maxLength = 500) {
      if (!content) return '';
      if (content.length <= maxLength) return content;
      return content.substring(0, maxLength) + '...';
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    async fetchMedia(movieId) {
      try {
        const imagesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=348088421ad3fb3a9d6e56bb6a9a8f80`
        );
        const imagesData = await imagesResponse.json();
        this.backdrops = imagesData.backdrops || [];
        this.posters = imagesData.posters || [];
        
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=348088421ad3fb3a9d6e56bb6a9a8f80&language=en-US`
        );
        const videosData = await videosResponse.json();
        this.videos = videosData.results || [];
      } catch (error) {
        console.error('Error fetching media:', error);
        this.backdrops = [];
        this.posters = [];
        this.videos = [];
      }
    },
    setActiveMediaTab(tab) {
      this.activeMediaTab = tab;
    },
    getBackdropUrl(path) {
      if (!path) return null;
      return `https://image.tmdb.org/t/p/w533_and_h300_bestv2${path}`;
    },
    getBackdropLargeUrl(path) {
      if (!path) return null;
      return `https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${path}`;
    },
    getPosterUrl(path) {
      if (!path) return null;
      return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`;
    },
    getVideoThumbnail(key) {
      if (!key) return null;
      return `https://i.ytimg.com/vi/${key}/hqdefault.jpg`;
    },
    playVideo(video) {
      if (video.site === 'YouTube') {
        window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank');
      }
    },
    async fetchMovieDetails(movieId) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=348088421ad3fb3a9d6e56bb6a9a8f80&language=en-US`
        );
        const data = await response.json();
        this.movie = { ...this.movie, ...data };
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    },
    getReleaseYear(dateString) {
      if (!dateString) return '';
      return new Date(dateString).getFullYear();
    },
    formatRuntime(minutes) {
      if (!minutes) return '';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    },
    getCertification() {
      if (this.movie.release_dates && this.movie.release_dates.results) {
        const usRelease = this.movie.release_dates.results.find(r => r.iso_3166_1 === 'US');
        if (usRelease && usRelease.release_dates && usRelease.release_dates.length > 0) {
          return usRelease.release_dates[0].certification || '';
        }
      }
      return this.movie.certification || '';
    },
    getFormattedReleaseDate() {
      if (this.movie.release_date) {
        const date = new Date(this.movie.release_date);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        });
      }
      return '';
    },
    formatCurrency(amount) {
      if (!amount || amount === 0) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },
    async fetchKeywords(movieId) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=348088421ad3fb3a9d6e56bb6a9a8f80`
        );
        const data = await response.json();
        this.keywords = data.keywords || [];
      } catch (error) {
        console.error('Error fetching keywords:', error);
        this.keywords = [];
      }
    },
    getOriginalLanguageName(code) {
      if (!code) return '';
      const languageNames = {
        'en': 'English',
        'tr': 'Turkish',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ru': 'Russian',
        'pt': 'Portuguese',
        'ar': 'Arabic',
        'hi': 'Hindi'
      };
      return languageNames[code] || code.toUpperCase();
    },
    getGradientStyle() {
      return {
        backgroundImage: this.movie.backdrop_path 
          ? `linear-gradient(to right, rgba(255, 255, 255, 0.9) calc((50vw - 170px) - 340px), rgba(240, 240, 240, 0.85) 50%, rgba(230, 230, 230, 0.8) 100%), url(${this.getBackdropLargeUrl(this.movie.backdrop_path)})`
          : 'none',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      };
    }
  }
};
</script>

<template>
  <Navbar/>
  <MovieContentView>
      <div 
        class="content-wrapper flex flex-row gap-4 p-10 mb-10 relative"
        :style="getGradientStyle()"
      >
        <img :src="getImageUrl(movie.poster_path)" alt="Poster" class="poster-image">
        <div class="information">
          <div class="title ott_false mb-4">
            <h2 class="text-3xl font-semibold mb-2">
              <a :href="`/movie/${movie.id}`" class="hover:text-blue-600">{{ movie.title }}</a>
              <span v-if="getReleaseYear(movie.release_date)" class="tag release_date text-gray-500 font-normal ml-2">
                ({{ getReleaseYear(movie.release_date) }})
              </span>
            </h2>
            
            <div class="facts flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span v-if="getCertification()" class="certification px-2 py-1 border border-gray-300 rounded">
                {{ getCertification() }}
              </span>
              
              <span v-if="getFormattedReleaseDate()" class="release">
                {{ getFormattedReleaseDate() }}
              </span>
              
              <span v-if="movie.genres && movie.genres.length > 0" class="genres">
                <template v-for="(genre, index) in movie.genres" :key="genre.id">
                  <a :href="`/genre/${genre.id}-${genre.name.toLowerCase().replace(/\s+/g, '-')}/movie`" class="hover:text-blue-600">
                    {{ genre.name }}
                  </a>
                  <span v-if="index < movie.genres.length - 1">, </span>
                </template>
              </span>
              
              <span v-if="movie.runtime" class="runtime">
                {{ formatRuntime(movie.runtime) }}
              </span>
            </div>
          </div>
          
          <div class="rate-container flex flex-row items-center gap-2 mb-4">
            <div class="flex flex-row items-center gap-4">
              <div class="flex justify-center items-center w-10 h-10 p-2 rounded-full border-4 z-10 top-56 left-5 leading-none text-center text-xs font-bold text-white bg-[#081c21]" :style="{ borderColor: voteBorderColor }">
                {{ formattedVoteAverage }}
              </div>
              <span class="user-score-text text-s text-black-600 mt-1 text-center leading-tight font-medium">User<br>Score</span>
              
              <div id="vibes_label" class="group flex items-center justify-center space-2 rating_false reactions_false bg-tmdb-dark-blue rounded-full cursor-pointer hover:scale-105 transition ease-in-out duration-150 px-4 py-2" data-role="tooltip">
                <div class="flex items-center justify-center">
                  <div id="vibes_content" class="flex items-center text-white font-bold cursor-pointer transform">
                    <div class="flex flex-nowrap items-center whitespace-nowrap">
                      What's your <span class="flex pl-1 underline underline-offset-2 decoration-2" style="text-decoration-color: #01b4e4;">Vibe</span>?
                      <span id="vibes_tooltip" class="glyphicons_v2 circle-info !invert ml-1" data-element="vibes_label">
                        <i class="pi pi-info-circle text-white text-sm"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <ul class="auto actions flex items-center gap-2 mb-4">
              <li class="tooltip use_tooltip list tooltip_hover" title="Login to create and edit custom lists" data-role="tooltip">
                <a class="no_click flex items-center justify-center bg-tmdb-dark-blue-action hover:opacity-90 rounded-full transition-colors p-5" href="#">
                  <i class="pi pi-th-large text-white"></i>
                </a>
              </li>
              <li class="tooltip use_tooltip" title="Add this movie to your favorite list" data-role="tooltip">
                <a 
                  id="favourite" 
                  class="no_click add_to_account_list favourite flex items-center justify-center rounded-full transition-colors p-5"
                  :class="isFavorite ? 'bg-red-100 hover:bg-red-200' : 'bg-tmdb-dark-blue-action hover:opacity-90'"
                  href="#"
                  @click.prevent="toggleFavorite"
                >
                  <i :class="isFavorite ? 'pi pi-heart-fill text-red-500' : 'pi pi-heart text-white'"></i>
                </a>
              </li>
              <li class="tooltip use_tooltip" title="Add this movie to your watchlist" data-role="tooltip">
                <a id="watchlist" class="no_click add_to_account_list watchlist flex items-center justify-center bg-tmdb-dark-blue-action hover:opacity-90 rounded-full transition-colors p-5" href="#">
                  <i class="pi pi-bookmark text-white"></i>
                </a>
              </li>
              <li v-if="firstTrailer" class="video none flex items-center ml-1">
                <a 
                  class="no_click play_trailer font-bold flex items-center gap-2 px-4 py-2 text-black rounded-full transition-colors hover:opacity-80" 
                  href="#"
                  @click.prevent="playVideo(firstTrailer)"
                  :data-site="firstTrailer.site"
                  :data-id="firstTrailer.key"
                  data-title="Play Trailer"
                >
                  <i class="pi pi-play text-black"></i>
                  <span class="text-black">Play Trailer</span>
                </a>
              </li>
            </ul>
          
          <div class="header_info">
            <h3 v-if="movie.tagline" class="tagline text-xl font-semibold mb-3 italic text-gray-600">{{ movie.tagline }}</h3>
            
            <h3 class="text-xl font-semibold mb-2">Overview</h3>
            <div class="overview mb-4">
              <p>{{ movie.overview }}</p>
            </div>

            <ol v-if="directors.length > 0 || writers.length > 0 || mainCast.length > 0" class="people no_image space-y-2">
              <li v-for="director in directors" :key="director.id" class="profile">
                <p class="font-bold">
                  <a :href="`https://www.themoviedb.org/person/${director.id}`" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                    {{ director.name }}
                  </a>
                </p>
                <p class="character text-sm text-gray-600">Director</p>
              </li>
              
              <li v-for="writer in writers.slice(0, 3)" :key="writer.id" class="profile">
                <p class="font-bold">
                  <a :href="`https://www.themoviedb.org/person/${writer.id}`" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                    {{ writer.name }}
                  </a>
                </p>
                <p class="character text-sm text-gray-600">{{ writer.job }}</p>
              </li>
              
              <li v-for="actor in mainCast" :key="actor.id" class="profile">
                <p class="font-bold">
                  <a :href="`https://www.themoviedb.org/person/${actor.id}`" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                    {{ actor.name }}
                  </a>
                </p>
                <p class="character text-sm text-gray-600">{{ getCharacterName(actor) }}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      <div class="main-content-layout flex gap-8 pl-10 pr-10 pb-10">
        <div class="left-column">
          <section v-if="cast.length > 0" class="panel top_billed scroller pb-10">
        <h3 class="mb-4 text-xl font-semibold">Top Billed Cast</h3>
        
        <div class="scroller_wrap should_fade is_fading overflow-x-scroll">
          <ol class="people scroller flex gap-4 pb-4" style="width: max-content;">
            <li v-for="(member, index) in cast.slice(0, 9)" :key="member.id" class="card flex-shrink-0" style="width: 138px;">
              <a :href="`https://www.themoviedb.org/person/${member.id}`" target="_blank" rel="noopener noreferrer" class="block">
                <div class="profile no_image_holder mb-2" style="width: 138px; height: 175px;">
                  <img 
                    v-if="getProfileImageUrl(member.profile_path)"
                    :src="getProfileImageUrl(member.profile_path)" 
                    :alt="member.name"
                    class="profile w-full h-full object-cover rounded"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <i class="pi pi-user text-gray-400 text-4xl"></i>
                  </div>
                </div>
              </a>
              <div class="card-content px-2 pb-2">
                <p class="text-sm font-medium mb-1 mt-2">
                  <a :href="`https://www.themoviedb.org/person/${member.id}`" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">{{ member.name }}</a>
                </p>
                <p class="character text-sm text-gray-600">{{ getCharacterName(member) }}</p>
              </div>
            </li>
            
            <li v-if="cast.length > 9" class="filler view_more flex-shrink-0 flex items-center justify-center" style="width: 138px;">
              <p>
                <a href="#" class="text-blue-600 text-sm">
                  View More <i class="pi pi-arrow-right ml-1"></i>
                </a>
              </p>
            </li>
          </ol>
        </div>
        
        <p class="new_button mt-4">
          <a href="#" class="text-blue-600">Full Cast & Crew</a>
        </p>
          </section>
          
          <section v-if="reviews.length > 0" class="panel media_panel social_panel pb-10">
        <section class="review">
          <div class="menu mb-4">
            <h3 class="text-xl font-semibold mb-3">Social</h3>
            <ul class="flex gap-4 border-b">
              <li :class="{ active: activeTab === 'reviews' }">
                <a 
                  href="#" 
                  @click.prevent="setActiveTab('reviews')"
                  class="media_panel pb-2 px-2 hover:text-blue-600"
                  :class="{ 'border-b-2 border-blue-600 text-blue-600': activeTab === 'reviews' }"
                >
                  Reviews <span class="ml-1">({{ reviews.length }})</span>
                </a>
              </li>
              <li :class="{ active: activeTab === 'discussions' }">
                <a 
                  href="#" 
                  @click.prevent="setActiveTab('discussions')"
                  class="media_panel pb-2 px-2 hover:text-blue-600"
                  :class="{ 'border-b-2 border-blue-600 text-blue-600': activeTab === 'discussions' }"
                >
                  Discussions <span class="ml-1">({{ discussions.length }})</span>
                </a>
              </li>
            </ul>
          </div>

          <div class="content">
            <div v-if="activeTab === 'reviews'" class="original_content">
              <div class="review_container">
                <div v-for="review in reviews.slice(0, 3)" :key="review.id" class="card mb-4 p-4 bg-white rounded-lg shadow">
                  <div class="grouped flex gap-4 mb-3">
                    <div class="avatar flex-shrink-0">
                      <a :href="`https://www.themoviedb.org/u/${review.author_details?.username || review.author}`" target="_blank" rel="noopener noreferrer">
                        <img 
                          v-if="getAvatarUrl(review.author_details?.avatar_path)"
                          :src="getAvatarUrl(review.author_details?.avatar_path)" 
                          :alt="review.author_details?.name || review.author"
                          class="avatar w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                          @error="$event.target.style.display='none'"
                        />
                        <div v-else class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <i class="pi pi-user text-gray-400"></i>
                        </div>
                      </a>
                    </div>

                    <div class="info flex-1">
                      <h3 class="font-semibold mb-2">
                        <a :href="review.url" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                          A review by {{ review.author_details.name || review.author }}
                        </a>
                      </h3>
                      <div class="flex items-center gap-4 flex-wrap">
                        <div v-if="review.author_details.rating" class="rating_border rating flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded">
                          <i class="pi pi-star text-yellow-500"></i>
                          <span class="font-semibold">{{ review.author_details.rating * 10 }}</span>
                          <span class="percent">%</span>
                        </div>
                        <h5 class="text-sm text-gray-600">
                          Written by 
                          <a :href="`https://www.themoviedb.org/u/${review.author_details.username}`" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                            {{ review.author_details.name || review.author }}
                          </a> 
                          on {{ formatDate(review.created_at) }}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div class="teaser text-gray-700 leading-relaxed">
                    <p v-html="truncateContent(review.content).replace(/\r\n/g, '<br>')"></p>
                    <a :href="review.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                      read the rest.
                    </a>
                  </div>
                </div>

                <p class="new_button mt-4">
                  <a :href="`https://www.themoviedb.org/movie/${movie.id}/reviews`" target="_blank" rel="noopener noreferrer" class="text-blue-600">
                    Read All Reviews
                  </a>
                </p>
              </div>
            </div>

            <div v-if="activeTab === 'discussions'" class="original_content">
              <div class="review_container">
                <p class="text-gray-600">No discussions available yet.</p>
              </div>
            </div>
          </div>
        </section>
          </section>
          
          <section v-if="videos.length > 0 || backdrops.length > 0 || posters.length > 0" class="panel media_panel media scroller pb-10">
        <div class="menu mb-4">
          <h3 class="text-xl font-semibold mb-3">Media</h3>
          <ul class="flex gap-4 border-b">
            <li :class="{ active: activeMediaTab === 'popular' }">
              <a 
                href="#" 
                @click.prevent="setActiveMediaTab('popular')"
                class="media_panel pb-2 px-2 hover:text-blue-600"
                :class="{ 'border-b-2 border-blue-600 text-blue-600': activeMediaTab === 'popular' }"
              >
                Most Popular
              </a>
            </li>
            <li :class="{ active: activeMediaTab === 'videos' }">
              <a 
                href="#" 
                @click.prevent="setActiveMediaTab('videos')"
                class="media_panel pb-2 px-2 hover:text-blue-600"
                :class="{ 'border-b-2 border-blue-600 text-blue-600': activeMediaTab === 'videos' }"
              >
                Videos <span class="ml-1">({{ videos.length }})</span>
              </a>
            </li>
            <li :class="{ active: activeMediaTab === 'backdrops' }">
              <a 
                href="#" 
                @click.prevent="setActiveMediaTab('backdrops')"
                class="media_panel pb-2 px-2 hover:text-blue-600"
                :class="{ 'border-b-2 border-blue-600 text-blue-600': activeMediaTab === 'backdrops' }"
              >
                Backdrops <span class="ml-1">({{ backdrops.length }})</span>
              </a>
            </li>
            <li :class="{ active: activeMediaTab === 'posters' }">
              <a 
                href="#" 
                @click.prevent="setActiveMediaTab('posters')"
                class="media_panel pb-2 px-2 hover:text-blue-600"
                :class="{ 'border-b-2 border-blue-600 text-blue-600': activeMediaTab === 'posters' }"
              >
                Posters <span class="ml-1">({{ posters.length }})</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="scroller_wrap should_fade is_fading overflow-x-scroll">
          <div class="h_scroller content scroller flex gap-4 pb-4" style="width: max-content;">
            <template v-if="activeMediaTab === 'popular'">
              <div v-for="video in videos.slice(0, 3)" :key="video.id" class="video card no_border flex-shrink-0" style="width: 300px; height: 169px;">
                <div class="wrapper relative w-full h-full rounded overflow-hidden" :style="{ backgroundImage: `url(${getVideoThumbnail(video.key)})` }">
                  <a 
                    href="#" 
                    @click.prevent="playVideo(video)"
                    class="no_click play_trailer absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
                  >
                    <div class="play_background w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                      <i class="pi pi-play text-white text-xl ml-1"></i>
                    </div>
                  </a>
                </div>
              </div>
              <div v-for="backdrop in backdrops.slice(0, 3)" :key="backdrop.file_path" class="backdrop flex-shrink-0" style="width: 300px; height: 169px;">
                <img 
                  :src="getBackdropUrl(backdrop.file_path)" 
                  :alt="movie.title"
                  class="backdrop w-full h-full object-cover rounded"
                  loading="lazy"
                />
              </div>
              <div v-for="poster in posters.slice(0, 3)" :key="poster.file_path" class="poster flex-shrink-0" style="width: 150px; height: 225px;">
                <img 
                  :src="getPosterUrl(poster.file_path)" 
                  :alt="movie.title"
                  class="poster w-full h-full object-cover rounded"
                  loading="lazy"
                />
              </div>
            </template>

            <template v-if="activeMediaTab === 'videos'">
              <div v-for="video in videos" :key="video.id" class="video card no_border flex-shrink-0" style="width: 300px; height: 169px;">
                <div class="wrapper relative w-full h-full rounded overflow-hidden" :style="{ backgroundImage: `url(${getVideoThumbnail(video.key)})` }">
                  <a 
                    href="#" 
                    @click.prevent="playVideo(video)"
                    class="no_click play_trailer absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
                  >
                    <div class="play_background w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                      <i class="pi pi-play text-white text-xl ml-1"></i>
                    </div>
                  </a>
                </div>
              </div>
            </template>

            <template v-if="activeMediaTab === 'backdrops'">
              <div v-for="backdrop in backdrops" :key="backdrop.file_path" class="backdrop flex-shrink-0" style="width: 300px; height: 169px;">
                <img 
                  :src="getBackdropUrl(backdrop.file_path)" 
                  :alt="movie.title"
                  class="backdrop w-full h-full object-cover rounded"
                  loading="lazy"
                />
              </div>
            </template>

            <template v-if="activeMediaTab === 'posters'">
              <div v-for="poster in posters" :key="poster.file_path" class="poster flex-shrink-0" style="width: 150px; height: 225px;">
                <img 
                  :src="getPosterUrl(poster.file_path)" 
                  :alt="movie.title"
                  class="poster w-full h-full object-cover rounded"
                  loading="lazy"
                />
              </div>
            </template>
          </div>
        </div>
          </section>
        </div>
        
        <div class="right-column">
          <section class="facts left_column pb-10">
            <div v-if="movie.homepage" class="social_links mb-4">
              <div class="homepage">
                <a 
                  :href="movie.homepage" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="social_link inline-block"
                  title="Homepage"
                >
                  <i class="pi pi-link text-blue-600 text-xl"></i>
                </a>
              </div>
            </div>

            <p v-if="movie.status" class="mb-2">
              <strong><bdi>Status</bdi></strong> {{ movie.status }}
            </p>

            <p v-if="movie.original_language" class="mb-2">
              <strong><bdi>Original Language</bdi></strong> {{ getOriginalLanguageName(movie.original_language) }}
            </p>

            <p v-if="movie.budget" class="mb-2">
              <strong><bdi>Budget</bdi></strong> {{ formatCurrency(movie.budget) }}
            </p>

            <p v-if="movie.revenue" class="mb-2">
              <strong><bdi>Revenue</bdi></strong> {{ formatCurrency(movie.revenue) }}
            </p>
          </section>

          <section v-if="keywords.length > 0" class="keywords right_column pb-10">
            <h4 class="mb-3 text-lg font-semibold"><bdi>Keywords</bdi></h4>
            <ul class="flex flex-wrap gap-2">
              <li v-for="keyword in keywords" :key="keyword.id">
                <a 
                  :href="`/keyword/${keyword.id}-${keyword.name.toLowerCase().replace(/\s+/g, '-')}/movie`" 
                  class="rounded px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {{ keyword.name }}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
      
    <RecommenderItem class="!content-start pl-10 !mt-0"/>
  </MovieContentView>
</template>

<style scoped>
.bg-tmdb-dark-blue {
  background-color: #081c22;
}

.bg-tmdb-dark-blue-action {
  background-color: rgb(3, 37, 65);
}

.decoration-tmdb-light-blue {
  --tw-decoration-color: #01b4e4;
}

.user-score-text {
  letter-spacing: 0.025em;
}

.user-score-text:hover {
  color: #1f2937;
}

.poster-image {
  width: 25%;
  height: fit-content;
}

.main-content-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.left-column {
  width: 80%;
  flex: 0 0 80%;
}

.right-column {
  width: 20%;
  flex: 0 0 20%;
}

.people.no_image {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

a {
  color: #000000;
  font-weight: bold;
  text-decoration: none;
}

a:hover {
  text-decoration: none !important;
}

.scroller_wrap {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.scroller_wrap::-webkit-scrollbar {
  height: 8px;
}

.scroller_wrap::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 4px;
}

.scroller_wrap::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.scroller_wrap::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.content-wrapper {
  border-bottom: 1px solid rgba(178.5, 199.5, 199.5, 0.3);
}

@media only screen and (min-width: 1900px) {
  .content-wrapper {
    background-size: auto !important;
  }
}
</style>
