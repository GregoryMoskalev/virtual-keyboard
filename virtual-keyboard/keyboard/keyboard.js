const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    language: 0
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
      ',',
      '.',
      '?',
      'en',
      'done',
      'space',
      'arrowLeft',
      'arrowRight'
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
      'arrowRight'
    ]
  ],

  init() {
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
          console.log(currentValue, this.properties.value);
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

    document.addEventListener('keyup', (evt) => {
      document.querySelectorAll('.keyboard__key').forEach((button) => {
        if (button.innerHTML == evt.key) {
          button.classList.remove('active');
        }
      });
      if (!evt.key[1]) {
        this.properties.value = document.activeElement.value;
      }
    });

    document.addEventListener('keydown', (evt) => {
      document.querySelectorAll('.keyboard__key').forEach((button) => {
        if (button.innerHTML == evt.key) {
          button.classList.add('active');
        }
      });
    });

    //#####################
    document.addEventListener('keydown', (evt) => {
      switch (evt.key) {
        case 'Tab':
          evt.preventDefault();
          this.properties.value += '	';
          this._triggerEvent('oninput');
          break;
        case 'Shift':
          this._toggleShift();
          document
            .querySelector('.shift')
            .classList.toggle('keyboard__key--active', this.properties.shift);
          break;
        case 'CapsLock':
          this._toggleCapsLock();
          document
            .querySelector('.caps')
            .classList.toggle('keyboard__key--active', this.properties.capsLock);
          break;
        case 'Backspace':
          document.querySelector('.backspace').classList.toggle('active');
          break;
        case 'Enter':
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
        [ 'backspace', '\\', 'enter', '?' ].indexOf(Array.isArray(key) ? key[0] : key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      switch (key) {
        case 'arrowLeft':
          keyElement.classList.add('arrowLeft');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');
          keyElement.addEventListener('click', () => this._arrowLeft());
          break;
        case 'arrowRight':
          keyElement.classList.add('arrowRight');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');
          keyElement.addEventListener('click', () => this._rightArrow());
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
            this._disableShift();
            this._handleBackspace();
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'caps');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide', 'enter');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });

          break;

        case 'space':
          this._disableShift();
          keyElement.classList.add('keyboard__key--extra-wide', 'space');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
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
          let element = this.keyLayout[this.properties.language][index];
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
    console.log('triggerEvent', this.properties.value);
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
    console.log('_changeLanguage');
    this.properties.language = (this.properties.language + 1) % this.keyLayout.length;
    for (let index = 0; index < this.elements.keys.length; index++) {
      const key = this.elements.keys[index];
      if (key.childElementCount === 0) {
        key.textContent = Array.isArray(this.keyLayout[this.properties.language][index])
          ? this.keyLayout[this.properties.language][index][0]
          : this.keyLayout[this.properties.language][index];
      }
    }
    console.log('this.properties.language', this.properties.language);
  },

  _toggleShift() {
    console.log('_toggleShift');
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
    console.log('_disableShift');
    if (this.properties.shift) {
      this._toggleShift();
      document
        .querySelector('.shift')
        .classList.toggle('keyboard__key--active', this.properties.shift);
    }
  },

  _toggleCapsLock() {
    console.log('_toggleCapsLock');
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
  'font-size: 1px; padding: 150px 200px; line-height: 0; background: url("https://mind-exchange.com/app/media/2015/05/kung-fury-hacker.jpeg"); background-size: 454px 302px; color: transparent;'
);
