'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const sass = require('gulp-ruby-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const cssbeautify = require('gulp-cssbeautify')

gulp.task('express', () => {
  const express = require('express')
  const app = express()
  app.use(require('connect-livereload')({
    port: 35729
  }))
  app.use(express.static(__dirname))
  app.listen(4000, '0.0.0.0')
})

let tinylr

gulp.task('livereload', () => {
  tinylr = require('tiny-lr')()
  tinylr.listen(35729)
})

const notifyLiveReload = (event) => {
  const fileName = require('path').relative(__dirname, event.path)

  tinylr.changed({
    body: {
      files: [fileName]
    }
  })
}

gulp.task('default', () => (
  gulp.src('js/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('build/js'))
))

gulp.task('styles', () => (
  sass('scss')
  .pipe(autoprefixer())
  .pipe(cssbeautify({
    indent: '  '
  }))
  .pipe(gulp.dest('css'))
  .pipe(cleanCSS({
    compatibility: 'ie8'
  }))
  .pipe(rename({
    extname: '.min.css'
  }))
  .pipe(gulp.dest('css'))
))

gulp.task('watch', () => {
  gulp.watch('scss/*.scss', ['styles'])
  gulp.watch(['*.html', 'css/*.css'], notifyLiveReload)
})

gulp.task('default', ['styles', 'express', 'livereload', 'watch'])
