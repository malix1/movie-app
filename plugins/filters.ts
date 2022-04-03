import Vue from 'vue'

Vue.filter('fixDigitBy1', (val: number) => val.toFixed(1))
Vue.filter('fixDigitBy0', (val: number) => val.toFixed(0))