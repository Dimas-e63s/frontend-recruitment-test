/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if (
    'serviceWorker' in navigator
    && (window.location.protocol === 'https:' || isLocalhost)
  ) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function() {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            const installingWorker = registration.installing;

            installingWorker.onstatechange = function() {
              switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                    'service worker became redundant.');

              default:
                  // Ignore
              }
            };
          }
        };
      }).catch(function(e) {
        console.error('Error during service worker registration:', e);
      });
  }

  // Your custom JavaScript goes here
  // === Copy Img Functionality ===
  const copyBtn = document.querySelector('.copy-btn');
  const imgToClone = document.querySelector('#img-clone');
  const imgCloneContainer = document.querySelector('.clone-container');

  copyBtn.addEventListener('click', cloneImg);

  const makeImgInstance = () => {
    const newImg = document.createElement('img');
    newImg.src = imgToClone.src;
    newImg.classList.add('cloned-img');
    return newImg;
  };
  const imgInstance = makeImgInstance();

  function cloneImg() {
    imgCloneContainer.appendChild(imgInstance.cloneNode(true));
  }
  // === Validate Functionality ===
  Maska.create('#form .masked');
  class FormValidator {
    constructor(form, fields) {
      this.form = form
      this.fields = fields
    }  
    
    initialize() {
      this.validateOnSubmit()
    }
    
    validateOnSubmit () {
      // let self = this
      
      this.form.addEventListener('submit', e => {
        e.preventDefault()
        this.fields.forEach(field => {
          const input = document.querySelector(`#${field}`)
          this.validateFields(input)
        })
      })
    }
    
    validateFields(field) {
      if (field.value.trim() === '') {
        return this.setStatus(field, `${field.previousElementSibling.innerText} cannot be blank`, 'error')
      } else {
        this.setStatus(field, null, 'success')
      }
      
      if (field.type === 'email') {
        const re = /\S+@\S+\.\S+/
        if (re.test(field.value)) {
          this.setStatus(field, null, 'success')
        } else {
          this.setStatus(field, 'Please enter valid email address', 'error')
        }
      }
      if(field.id === 'expire_date') {
        const {now, expireDate} = this.parseDate(field.value)

        if(expireDate < now) {
          this.setStatus(field, 'Please enter valid expiration date', 'error')
        } else {
          this.setStatus(field, null, 'success')
        }
      }

      if(field.id === 'secure_code') {
        const re = /^[0-9]+$/
        if(re.test(field.value)) {
          this.setStatus(field, null, 'success')
        } else {
          this.setStatus(field, 'Secure code must contain only numbers', 'error')
        }
      }

      if(field.id === 'card_number') {
        if(field.value.startsWith('4')) {
          this.setStatus(field, null, 'success')
        } else {
          this.setStatus(field, 'Card Number of Visa must starts with 4', 'error')
        }
      }
    }

    parseDate(date) {
      const [month, year] = date.split('/')
      const parsedMonth = +month === 1 ? 0 : +month - 1
      const pasrsedYear = Number(`20${year}`)

      return {
        now: new Date().getTime(),
        expireDate: new Date(pasrsedYear, parsedMonth)
      }
    }
  
    setStatus(field, message, status) {
      const errorMessage = field.parentElement.parentElement.querySelector('.error-message')
  
      if (status === 'success') {
        if (errorMessage) { errorMessage.innerText = '' }
        field.parentElement.classList.add('success')
        field.parentElement.classList.remove('invalid')
      } 
      
      if (status === 'error') {
        field.parentElement.parentElement.querySelector('.error-message').innerText = message
        field.parentElement.classList.remove('success')
        field.parentElement.classList.add('invalid')
      }    
    }
  }
  
  const form = document.querySelector('.checkout__form')
  const fields = [
    'first_name', 
    'last_name', 
    'email', 
    'postal_code', 
    'expire_date', 
    'secure_code',
    'card_number',
    'phone_number'
  ]
  
  const validator = new FormValidator(form, fields)
  validator.initialize()

})();
