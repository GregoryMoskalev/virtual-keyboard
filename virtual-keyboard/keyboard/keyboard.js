window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    sounds: {
      tab: null,
      caps: null,
      shift: null,
      space: null,
      backspace: null,
      enter: null,
      arrowLeft: null,
      arrowRight: null,
      letters: [ null, null ]
    },
    record: null
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    language: 0,
    sound: true,
    mic: false
  },

  keyLayout: [
    [
      [ '`', '~' ],
      [ '1', '!' ],
      [ '2', '@' ],
      [ '3', '#' ],
      [ '4', '$' ],
      [ '5', '%' ],
      [ '6', '^' ],
      [ '7', '&' ],
      [ '8', '*' ],
      [ '9', '(' ],
      [ '0', ')' ],
      [ '-', '_' ],
      [ '=', '+' ],
      'backspace',
      'tab',
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      [ '[', '{' ],
      [ ']', '}' ],
      [ '\\', '|' ],
      'caps',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      [ ';', ':' ],
      [ "'", '"' ],
      'enter',
      'shift',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      [ ',', '<' ],
      [ '.', '>' ],
      [ '/', '?' ],
      'en',
      'done',
      'space',
      'arrowLeft',
      'arrowRight',
      'sound',
      'mic'
    ],
    [
      'ё',
      [ '1', '!' ],
      [ '2', '"' ],
      [ '3', '№' ],
      [ '4', ';' ],
      [ '5', '%' ],
      [ '6', ':' ],
      [ '7', '?' ],
      [ '8', '*' ],
      [ '9', '(' ],
      [ '0', ')' ],
      [ '-', '_' ],
      [ '=', '+' ],
      'backspace',
      'tab',
      'й',
      'ц',
      'у',
      'к',
      'е',
      'н',
      'г',
      'ш',
      'щ',
      'з',
      'х',
      'ъ',
      [ '\\', '|' ],
      'caps',
      'ф',
      'ы',
      'в',
      'а',
      'п',
      'р',
      'о',
      'л',
      'д',
      'ж',
      'э',
      'enter',
      'shift',
      'я',
      'ч',
      'с',
      'м',
      'и',
      'т',
      'ь',
      'б',
      'ю',
      [ '.', ',' ],
      'ru',
      'done',
      'space',
      'arrowLeft',
      'arrowRight',
      'sound',
      'mic'
    ]
  ],

  init() {
    this.elements.record = new SpeechRecognition();

    this.elements.record.interimResults = true;
    this.elements.sounds.tab = new Audio('../../assets/si.mp3');
    this.elements.sounds.caps = new Audio('../../assets/re.mp3');
    this.elements.sounds.shift = new Audio('../../assets/mi.mp3');
    this.elements.sounds.space = new Audio('../../assets/fa.mp3');
    this.elements.sounds.backspace = new Audio('../../assets/lja.mp3');
    this.elements.sounds.enter = new Audio('../../assets/sol.mp3');
    this.elements.sounds.arrowLeft = new Audio('../../assets/20af166b0a13e92.mp3');
    this.elements.sounds.arrowRight = new Audio('../../assets/70b088eeae5b483.mp3');
    this.elements.sounds.letters[0] = new Audio('../../assets/noty-do.mp3');
    this.elements.sounds.letters[1] = new Audio('../../assets/cement-floor-01.mp3');
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          const cursor = element.selectionStart;
          if (element.selectionStart < element.value.length) {
            this.properties.value = `${this.properties.value.slice(0, cursor)}${currentValue.slice(
              -1
            )}${this.properties.value.slice(cursor, -1)}`;

            element.value = currentValue = this.properties.value;
            element.selectionStart = element.selectionEnd = cursor + 1;
          } else {
            element.value = currentValue;
          }
        });
      });
    });
    // stop losing focus after click on keyboard
    document.querySelector('.keyboard').addEventListener('mousedown', (e) => {
      e.preventDefault();
    });

    let text = [];
    this.elements.record.addEventListener('result', (evt) => {
      text = Array.from(evt.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(text);
    });

    this.elements.record.addEventListener('end', () => {
      document.querySelector('.use-keyboard-input').value = this.properties.value += text;
      text = [];
      if (this.properties.mic) {
        this.elements.record.lang = this.properties.language ? 'ru-RU' : 'en-US';
        this.elements.record.start();
      }
    });

    document.addEventListener('keyup', (evt) => {
      document.querySelectorAll('.keyboard__key').forEach((button) => {
        if (button.innerHTML.toLowerCase() == evt.key.toLowerCase()) {
          button.classList.remove('active');
        } else if (this.properties.shift) {
          this.keyLayout[this.properties.language].forEach((key, index) => {
            if (key[1] === evt.key || key[0] === evt.key)
              this.elements.keys[index].classList.remove('active');
          });
        }
        // else if (this.properties.shift) {
        //   this.keyLayout[
        //     (this.properties.language + 1) % this.keyLayout.length
        //   ].forEach((key, index) => {
        //     if (key[1] === evt.key || key[0] === evt.key)
        //       this.elements.keys[index].classList.remove('active');
        //   });
        // }
      });
      if (!evt.key[1]) {
        this.properties.value = document.activeElement.value;
      }
    });

    document.addEventListener('keydown', (evt) => {
      // window.speechSynthesis.speak(new SpeechSynthesisUtterance(evt.key));
      document.querySelectorAll('.keyboard__key').forEach((button) => {
        if (button.innerHTML.toLowerCase() == evt.key.toLowerCase()) {
          button.classList.add('active');
          if (this.properties.sound) {
            this.elements.sounds.letters[this.properties.language].currentTime = 0;
            this.elements.sounds.letters[this.properties.language].play();
          }
        } else if (this.properties.shift) {
          this.keyLayout[this.properties.language].forEach((key, index) => {
            if (key[1] === evt.key || key[0] === evt.key)
              this.elements.keys[index].classList.add('active');
            // this.elements.sounds.letters[this.properties.language].currentTime = 0;
            // this.elements.sounds.letters[this.properties.language].play();
          });
        }
        // else if (this.properties.shift) {
        //   this.keyLayout[
        //     (this.properties.language + 1) % this.keyLayout.length
        //   ].forEach((key, index) => {
        //     if (key[1] === evt.key || key[0] === evt.key)
        //       this.elements.keys[index].classList.add('active');
        //   });
        // }
      });
    });

    //#####################
    document.addEventListener('keydown', (evt) => {
      if ((evt.shiftKey && evt.ctrlKey) || evt.altKey) {
        document.querySelector('.language').classList.add('active');
        this._changeLanguage();
      }
    });
    document.addEventListener('keyup', (evt) => {
      if (evt.shiftKey || evt.ctrlKey || evt.altKey) {
        document.querySelector('.language').classList.remove('active');
      }
    });
    document.addEventListener('keydown', (evt) => {
      switch (evt.key) {
        case 'Tab':
          evt.preventDefault();
          document.querySelector('.tab').classList.add('active');
          if (this.properties.sound) {
            this.elements.sounds.tab.currentTime = 0;
            this.elements.sounds.tab.play();
          }
          this.properties.value += '	';
          this._triggerEvent('oninput');
          break;
        case 'Shift':
          if (!evt.ctrlKey && !evt.altKey) {
            document.querySelector('.shift').classList.toggle('keyboard__key--active');
            document.querySelector('.shift').classList.add('active');
            this._toggleShift();
          }
          break;
        case 'CapsLock':
          if (this.properties.sound) {
            this.elements.sounds.caps.currentTime = 0;
            this.elements.sounds.caps.play();
          }
          this._toggleCapsLock();
          document.querySelector('.caps').classList.toggle('keyboard__key--active');
          document.querySelector('.caps').classList.add('active');
          break;
        case 'Backspace':
          if (this.properties.sound) {
            this.elements.sounds.backspace.currentTime = 0;
            this.elements.sounds.backspace.play();
          }
          document.querySelector('.backspace').classList.add('active');
          break;
        case 'Enter':
          if (this.properties.sound) {
            this.elements.sounds.enter.currentTime = 0;
            this.elements.sounds.enter.play();
          }
          document.querySelector('.enter').classList.add('active');
          break;
        case 'ArrowLeft':
          if (this.properties.sound) {
            this.elements.sounds.arrowLeft.currentTime = 0;
            this.elements.sounds.arrowLeft.play();
          }
          document.querySelector('.arrowLeft').classList.add('active');
          break;
        case 'ArrowRight':
          if (this.properties.sound) {
            this.elements.sounds.arrowRight.currentTime = 0;
            this.elements.sounds.arrowRight.play();
          }
          document.querySelector('.arrowRight').classList.add('active');
          break;
        case ' ':
          if (this.properties.sound) {
            this.elements.sounds.space.currentTime = 0;
            this.elements.sounds.space.play();
          }
          document.querySelector('.space').classList.add('active');
          break;
      }
    });
    document.addEventListener('keyup', (evt) => {
      switch (evt.key) {
        case 'Tab':
          evt.preventDefault();
          document.querySelector('.tab').classList.remove('active');
          break;
        case 'Shift':
          document.querySelector('.shift').classList.remove('active');
          break;
        case 'CapsLock':
          document.querySelector('.caps').classList.remove('active');
          break;
        case 'Backspace':
          document.querySelector('.backspace').classList.remove('active');
          break;
        case 'Enter':
          document.querySelector('.enter').classList.remove('active');
          break;
        case 'ArrowLeft':
          document.querySelector('.arrowLeft').classList.remove('active');
          break;
        case 'ArrowRight':
          document.querySelector('.arrowRight').classList.remove('active');
          break;
        case ' ':
          document.querySelector('.space').classList.remove('active');
          break;
      }
    });
    //#####################
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    this.keyLayout[this.properties.language].forEach((key, index) => {
      const keyElement = document.createElement('button');
      const insertLineBreak =
        [ 'backspace', '\\', 'enter', '/' ].indexOf(Array.isArray(key) ? key[0] : key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      switch (key) {
        case 'mic':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('mic');

          keyElement.addEventListener('click', () => {
            this._toggleMic();
            keyElement.classList.toggle('keyboard__key--active', this.properties.mic);
          });
          break;
        case 'sound':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable',
            'keyboard__key--active'
          );
          keyElement.classList.add('sound');

          keyElement.innerHTML = createIconHTML('volume_up');

          keyElement.addEventListener('click', () => {
            this._toggleSound();
            keyElement.classList.toggle('keyboard__key--active', this.properties.sound);
          });
          break;
        case 'arrowLeft':
          keyElement.classList.add('arrowLeft');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');
          keyElement.addEventListener('click', () => {
            if (this.properties.sound) {
              this.elements.sounds.arrowLeft.currentTime = 0;
              this.elements.sounds.arrowLeft.play();
            }
            this._arrowLeft();
          });
          break;
        case 'arrowRight':
          keyElement.classList.add('arrowRight');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');
          keyElement.addEventListener('click', () => {
            if (this.properties.sound) {
              this.elements.sounds.arrowRight.currentTime = 0;
              this.elements.sounds.arrowRight.play();
            }
            this._rightArrow();
          });
          break;
        case 'en':
        case 'ru':
          keyElement.classList.add('language');
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this._changeLanguage();
          });

          break;
        case 'tab':
          keyElement.classList.add('tab');
          keyElement.innerHTML = createIconHTML('keyboard_tab');
          keyElement.addEventListener('click', () => {
            this.elements.sounds.tab.currentTime = 0;
            this.elements.sounds.tab.play();
            this.properties.value += '	';
            this._triggerEvent('oninput');
          });
          break;
        case 'shift':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'shift');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_up');

          keyElement.addEventListener('click', () => {
            this._toggleShift();
            keyElement.classList.toggle('keyboard__key--active', this.properties.shift);
          });

          break;
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide', 'backspace');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) {
              this.elements.sounds.backspace.currentTime = 0;
              this.elements.sounds.backspace.play();
            }
            this._disableShift();
            this._handleBackspace();
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'caps');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) {
              this.elements.sounds.caps.currentTime = 0;
              this.elements.sounds.caps.play();
            }
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide', 'enter');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) {
              this.elements.sounds.enter.currentTime = 0;
              this.elements.sounds.enter.play();
            }
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });

          break;

        case 'space':
          this._disableShift();
          keyElement.classList.add('keyboard__key--extra-wide', 'space');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) {
              this.elements.sounds.space.currentTime = 0;
              this.elements.sounds.space.play();
            }
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });

          break;

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        default:
          // let element = this.keyLayout[this.properties.language][index];
          // if (Array.isArray(key)) {
          keyElement.textContent = key[0].toLowerCase();

          // keyElement.addEventListener('click', () => {
          //   console.log('listener!', key, element, this.properties.language);
          //   this.properties.value += this.properties.capsLock
          //     ? (keyElement.textContent = this.properties.shift
          //         ? (keyElement.textContent = key[1])
          //         : (keyElement.textContent = key[0].toUpperCase()))
          //     : (keyElement.textContent = this.properties.shift
          //         ? (keyElement.textContent = key[1])
          //         : (keyElement.textContent = key[0].toUpperCase()));
          //   this._triggerEvent('oninput');
          //   this._disableShift();
          // });

          // keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) {
              this.elements.sounds.letters[this.properties.language].currentTime = 0;
              this.elements.sounds.letters[this.properties.language].play();
            }
            this.properties.value += this.properties.capsLock
              ? (keyElement.textContent = this.properties.shift
                  ? keyElement.textContent.toLowerCase()
                  : keyElement.textContent.toUpperCase())
              : (keyElement.textContent = this.properties.shift
                  ? keyElement.textContent.toUpperCase()
                  : keyElement.textContent.toLowerCase());
            this._triggerEvent('oninput');
            this._disableShift();
          });

          break;
      }
      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _handleBackspace() {
    const element = document.activeElement;
    const cursor = element.selectionStart;
    const left = this.properties.value.substring(0, element.selectionStart - 1);
    const right = this.properties.value.slice(cursor);

    if (element.selectionStart < element.value.length) {
      element.value = this.properties.value = `${left}${right}`;

      element.selectionStart = element.selectionEnd = cursor - 1;

      // this._triggerEvent('oninput');
    } else {
      element.value = this.properties.value = this.properties.value.substring(
        0,
        this.properties.value.length - 1
      );
      // this._triggerEvent('oninput');
    }
  },

  _toggleMic() {
    this.properties.mic = !this.properties.mic;
    if (this.properties.mic) {
      this.elements.record.lang = this.properties.language ? 'ru-RU' : 'en-US';
      this.elements.record.start();
    } else {
      this.elements.record.stop();
    }
  },
  _toggleSound() {
    this.properties.sound = !this.properties.sound;
  },

  _arrowLeft() {
    if (this.properties.shift) {
      document.activeElement.selectionStart--;
    } else {
      document.activeElement.selectionEnd = document.activeElement.selectionStart -= 1;
    }
  },

  _rightArrow() {
    if (this.properties.shift) {
      document.activeElement.selectionEnd++;
    } else {
      document.activeElement.selectionEnd = document.activeElement.selectionStart += 1;
    }
  },

  _changeLanguage() {
    this.properties.language = (this.properties.language + 1) % this.keyLayout.length;
    for (let index = 0; index < this.elements.keys.length; index++) {
      const key = this.elements.keys[index];
      if (key.childElementCount === 0) {
        key.textContent = Array.isArray(this.keyLayout[this.properties.language][index])
          ? this.keyLayout[this.properties.language][index][0]
          : this.keyLayout[this.properties.language][index];
      }
    }
    this.elements.record.stop();
  },

  _toggleShift() {
    if (this.properties.sound) {
      this.elements.sounds.shift.currentTime = 0;
      this.elements.sounds.shift.play();
    }

    this.properties.shift = !this.properties.shift;
    let index = 0;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (Array.isArray(this.keyLayout[this.properties.language][index])) {
          key.textContent = this.properties.shift
            ? (key.textContent = this.properties.capsLock
                ? (key.textContent = this.keyLayout[this.properties.language][index][1])
                : (key.textContent = this.keyLayout[this.properties.language][index][1]))
            : (key.textContent = this.properties.capsLock
                ? (key.textContent = this.keyLayout[this.properties.language][
                    index
                  ][0].toLowerCase())
                : (key.textContent = this.keyLayout[this.properties.language][
                    index
                  ][0].toLowerCase()));

          // key.textContent = this.properties.shift
          //   ? (key.textContent = this.properties.capsLock
          //       ? key.textContent.toLowerCase()
          //       : key.textContent.toUpperCase())
          //   : (key.textContent = this.properties.capsLock
          //       ? key.textContent.toUpperCase()
          //       : key.textContent.toLowerCase());
        } else {
          key.textContent = this.properties.shift
            ? (key.textContent = this.properties.capsLock
                ? key.textContent.toLowerCase()
                : key.textContent.toUpperCase())
            : (key.textContent = this.properties.capsLock
                ? key.textContent.toUpperCase()
                : key.textContent.toLowerCase());

          // key.textContent = this.properties.shift
          //   ? (key.textContent = this.properties.capsLock
          //       ? key.textContent.toLowerCase()
          //       : key.textContent.toUpperCase())
          //   : (key.textContent = this.properties.capsLock
          //       ? key.textContent.toUpperCase()
          //       : key.textContent.toLowerCase());
        }
      }
      index++;
    }
  },

  _disableShift() {
    if (this.properties.shift) {
      this._toggleShift();
      document
        .querySelector('.shift')
        .classList.toggle('keyboard__key--active', this.properties.shift);
    }
  },

  _toggleCapsLock() {
    let index = 0;
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (Array.isArray(this.keyLayout[this.properties.language][index])) {
          key.textContent = this.properties.shift
            ? (key.textContent = this.properties.capsLock
                ? (key.textContent = this.keyLayout[this.properties.language][index][1])
                : (key.textContent = this.keyLayout[this.properties.language][index][1]))
            : (key.textContent = this.properties.capsLock
                ? (key.textContent = this.keyLayout[this.properties.language][
                    index
                  ][0].toLowerCase())
                : (key.textContent = this.keyLayout[this.properties.language][
                    index
                  ][0].toLowerCase()));

          key.textContent = this.properties.shift
            ? (key.textContent = this.properties.capsLock
                ? key.textContent.toLowerCase()
                : key.textContent.toUpperCase())
            : (key.textContent = this.properties.capsLock
                ? key.textContent.toUpperCase()
                : key.textContent.toLowerCase());
        } else {
          key.textContent = this.properties.shift
            ? (key.textContent = this.properties.capsLock
                ? key.textContent.toLowerCase()
                : key.textContent.toUpperCase())
            : (key.textContent = this.properties.capsLock
                ? key.textContent.toUpperCase()
                : key.textContent.toLowerCase());

          // key.textContent = this.properties.shift
          //   ? (key.textContent = this.properties.capsLock
          //       ? key.textContent.toLowerCase()
          //       : key.textContent.toUpperCase())
          //   : (key.textContent = this.properties.capsLock
          //       ? key.textContent.toUpperCase()
          //       : key.textContent.toLowerCase());
        }

        // key.textContent = this.properties.shift
        //   ? key.textContent.toUpperCase()
        //   : key.textContent.toLowerCase();
      }
      index++;
    }

    // for (const key of this.elements.keys) {
    //   if (key.childElementCount === 0) {
    //     key.textContent = this.properties.capsLock
    //       ? (key.textContent = this.properties.shift
    //           ? key.textContent.toLowerCase()
    //           : key.textContent.toUpperCase())
    //       : (key.textContent = this.properties.shift
    //           ? key.textContent.toUpperCase()
    //           : key.textContent.toLowerCase());
    //   }
    // }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  }
};

window.addEventListener('DOMContentLoaded', function() {
  Keyboard.init();
});

console.log(
  '%c+',
  'font-size: 1px; padding: 160px 143px; line-height: 0; background: url("https://sun9-74.userapi.com/DjoL4F6_RqFFChpuQf3kkQ36MyEMfr2zJUgj1A/5ua4Ga3dykI.jpg"); background-size: 289px 385px; color: transparent;'
);

console.log('engL-DO');
console.log('caps-RE');
console.log('shift-MI');
console.log('space-FA');
console.log('enter-SOL');
console.log('backspace-LA');
console.log('tab-SI');

//  caps-<b>RE</b> shift-<b>MI</b> space-<b>FA</b> backspace-<b>LA</b> enter-<b>SOL</b> engL-<b>DO</b> ruL-just sound</h2>')
