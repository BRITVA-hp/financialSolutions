document.addEventListener('DOMContentLoaded', () => {


  // функция для модалки

  function calcScroll() {
    let div = document.createElement('div');

    div.style.width = '50px';
    div.style.height = '50px';
    div.style.overflowY = 'scroll';
    div.style.visibility = 'hidden';

    document.body.appendChild(div);
    let scarollWidth = div.offsetWidth - div.clientWidth;
    div.remove();

    return scarollWidth;
  }

  let scrollWidth = calcScroll();

  function modal(modal, modalActiveClass, triggers, modalClose) {
    const triggers_ = document.querySelectorAll(triggers),
      modal_ = document.querySelector(modal),
      modalClose_ = document.querySelector(modalClose);

    if (triggers_.length > 0) {
      triggers_.forEach(item => {
        item.addEventListener('click', () => {
          modal_.classList.add(modalActiveClass);
          document.body.style.overflow = 'hidden';
          document.body.style.marginRight = `${scrollWidth}px`;
        });
      });

      modalClose_.addEventListener('click', () => {
        modal_.classList.remove(modalActiveClass);
        document.body.style.overflow = '';
        document.body.style.marginRight = '0px';
      });

      modal_.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal__container')) {
          modal_.classList.remove(modalActiveClass);
          document.body.style.overflow = '';
          document.body.style.marginRight = '0px';
        }
      });
    }
  }

  modal('.modal-main', 'modal--active', '[data-modal]', '.modal__close');

  //burger

  const burger = document.querySelector('.header__burger')
  const menu = document.querySelector('.menu')
  const menuClose = document.querySelector('.menu__close')
  const menuLinks = document.querySelectorAll('.menu__link')

  burger.addEventListener('click', () => menu.classList.add('menu--active'))
  menuClose.addEventListener('click', () => menu.classList.remove('menu--active'))
  menu.addEventListener('click', e => {
    if (e.target.classList.contains('menu')) menu.classList.remove('menu--active')
  })
  menuLinks.forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('menu--active'))
  })

  //slider
  function slider(settings) {
    const window_ = document.querySelector(settings.windowSelector),
      field_ = document.querySelector(settings.fieldSelector),
      cards_ = document.querySelectorAll(settings.cardSelector),
      arrowPrev_ = document.querySelector(settings.buttonPrevSelector),
      arrowNext_ = document.querySelector(settings.buttonNextSelector),
      progress_ = document.querySelector(settings.progressSelector),
      dotsWrap_ = document.querySelector(settings.dotsWrapSelector);

    let startPoint,
      swipeAction,
      endPoint,
      sliderCounter = 0,
      dots_ = [],
      mouseMoveFlag = false,
      moveLastCardFlag = false

    if (window_) {

      // считаем расстояние между карточками
      // общая длина всех карточек + расстояния между ними
      const lengthCardAndBetweenCards = cards_[cards_.length - 1].getBoundingClientRect().right - window_.getBoundingClientRect().left;
      // расстояние между карточками
      const betweenCards = (lengthCardAndBetweenCards - (cards_[0].clientWidth * cards_.length)) / (cards_.length -1);

      // считаем количество карточек, помещающихся в окне
      function numberIntegerVisibleCards() {
        return Math.floor((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
      }
      // считаем на какая часть карточки не помещается
      function partCard() {
        return (window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards) - Math.trunc((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
      }
      // проверяем, показывается ли последняя карточка
      function lastCard() {
        if ( (sliderCounter + numberIntegerVisibleCards()) >= (cards_.length) && cards_.length > numberIntegerVisibleCards()) {
          sliderCounter = cards_.length - numberIntegerVisibleCards() - 1
          return true
        }
        return false
      }

      // проверяем, больше ли у нас карточек, чем может поместиться в видимой части слайдера
      function checkNumCards() {
        if (cards_.length > numberIntegerVisibleCards()) {
          return true
        }
        field_.style.transform = '';
        return false
      }

      //Устанавливаем ширину бегунка прогресс-бара
      if (progress_) {
        progress_.style.width = 100 / cards_.length + '%'
      }

      // Слайд следующий

      function slideNext(dots = false) {
        if (!checkNumCards()) {
          return
        }
        if(!dots) sliderCounter++;
        if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
        if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonActiveClass);
        if (sliderCounter >= cards_.length) {
          sliderCounter = cards_.length - 1;
        }
        if ((sliderCounter + 1) === cards_.length) {
          arrowNext_.classList.add(settings.buttonActiveClass);
        }
        if (progress_) progress_.style.left = (100 / cards_.length) * sliderCounter + '%'
        if (dotsWrap_) dots_.forEach(item => item.classList.remove(settings.dotActiveClass))
        if (lastCard()) {
          field_.style.transform = `translateX(-${field_.scrollWidth - window_.clientWidth}px)`
          sliderCounter = Math.ceil(cards_.length - numberIntegerVisibleCards() - partCard())
          dots_[dots_.length - 1].classList.add(settings.dotActiveClass)
          return
        }
        if (dotsWrap_) dots_[sliderCounter].classList.add(settings.dotActiveClass)
        field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;

      }

      // Слайд предыдущий

      function slidePrev(dots = false) {
        if (!checkNumCards()) {
          return
        }
        sliderCounter = Math.floor(sliderCounter)
        if(!dots) sliderCounter--;
        if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
        if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonActiveClass);
        if (sliderCounter <= 0) {
          sliderCounter = 0;
        }
        if (sliderCounter === 0 && arrowPrev_) {
          arrowPrev_.classList.add(settings.buttonActiveClass);
        }
        if (dotsWrap_) {
          dots_.forEach((item, index)=> {
            item.classList.remove(settings.dotActiveClass);
          });
          dots_[sliderCounter].classList.add(settings.dotActiveClass);
        }

        if (progress_) {
          progress_.style.left = (100 / cards_.length) * sliderCounter + '%'
        }
        field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
      }

      // Рендер точек

      if (dotsWrap_) {

        cards_.forEach(() => {
          const dot = document.createElement('div');
          dot.classList.add(settings.dotClass);
          dotsWrap_.appendChild(dot);
          dots_.push(dot);
        });
        dots_[0].classList.add(settings.dotActiveClass);
        dots_.forEach((item, index) => {
          item.addEventListener('click', () => {
            if (!checkNumCards()) {
              return
            }
            if (index > sliderCounter) {
              sliderCounter = index;
              slideNext(true)
              return
            }
            if (index < sliderCounter) {
              sliderCounter = index;
              slidePrev(true)
            }
          });
        });
      }

      // Переключение на стрелки
      if (arrowPrev_) {
        arrowPrev_.addEventListener('click', () => {
          slidePrev();
        });
      }

      if (arrowNext_) {
        arrowNext_.addEventListener('click', () => {
          slideNext();
        });
      }

      // Свайп слайдов тач-событиями

      window_.addEventListener('touchstart', (e) => {
        startPoint = e.changedTouches[0].pageX;
        if (lastCard() && numberIntegerVisibleCards() < cards_.length) moveLastCardFlag = true


      });

      window_.addEventListener('touchmove', (e) => {
        swipeAction = e.changedTouches[0].pageX - startPoint;
        if (moveLastCardFlag) {
          field_.style.transform = `translateX(${swipeAction + -(field_.clientWidth - document.documentElement.clientWidth)}px)`;
        } else {
          field_.style.transform = `translateX(${swipeAction + (-(cards_[0].scrollWidth + betweenCards) * sliderCounter)}px)`;

        }
      });

      window_.addEventListener('touchend', (e) => {
        moveLastCardFlag = false
        endPoint = e.changedTouches[0].pageX;
        if (Math.abs(startPoint - endPoint) > 50 && checkNumCards()) {
          if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
          if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonActiveClass);
          if (endPoint < startPoint) {
            slideNext();
          } else {
            slidePrev();
          }
        } else {
          field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
        }
      });

      // Свайп слайдов маус-событиями
      window_.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startPoint = e.pageX;
        mouseMoveFlag = true;
        if (lastCard()) moveLastCardFlag = true
      });
      window_.addEventListener('mousemove', (e) => {
        if (mouseMoveFlag) {
          e.preventDefault();
          swipeAction = e.pageX - startPoint;
          if (moveLastCardFlag) {
            field_.style.transform = `translateX(${swipeAction + -(field_.clientWidth - document.documentElement.clientWidth)}px)`;
          } else {
            field_.style.transform = `translateX(${swipeAction + (-(cards_[0].scrollWidth + betweenCards) * sliderCounter)}px)`;
          }
        }
      });
      window_.addEventListener('mouseup', (e) => {
        moveLastCardFlag = false
        mouseMoveFlag = false
        endPoint = e.pageX;
        if (Math.abs(startPoint - endPoint) > 50 && checkNumCards()) {
          if (arrowNext_) arrowNext_.classList.remove(settings.buttonActiveClass);
          if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonActiveClass);
          if (endPoint < startPoint) {
            slideNext();
          } else {
            slidePrev();
          }
        } else if(Math.abs(startPoint - endPoint) === 0) {
          return
        }
        else {
          field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
        }
      })
      window_.addEventListener('mouseleave', () => {
        if (mouseMoveFlag) {
          field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
        }
        mouseMoveFlag = false
        moveLastCardFlag = false
      })
    }
  }

  slider({
    windowSelector: '.services__window',
    fieldSelector: '.services__field',
    cardSelector: '.services__card',
    dotsWrapSelector: '.services__dots',
    dotClass: 'services__dot',
    dotActiveClass: 'services__dot--active',
    buttonPrevSelector: '.services__arrow--prev',
    buttonNextSelector: '.services__arrow--next'
  });

  function range(min, max) {
    //range
    const range = document.querySelector('.modal-quiz__range__input')
    const rangeTrack = document.querySelector('.modal-quiz__range__track')
    const rangeValue = document.querySelector('.modal-quiz__range__value')
    function prettify(num) {
      const n = num.toString();
      return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
    }

    range.addEventListener('input', function() {
      const position = (this.value.replace(/\D/g, '') * 100)/(max - min)
      rangeTrack.style.width = `${position}%`
      rangeValue.value = prettify(this.value)
    });

    rangeValue.addEventListener('input', function(e) {
      if (e.data) {
        this.value = prettify(this.value.replace(/\D/g, ''))
      }
      if (this.value.replace(/\D/g, '') > max) {
        this.value = '20 000 000'
      }
      const position = (this.value.replace(/\D/g, '') * 100)/(max - min)
      rangeTrack.style.width = `${position}%`
    })
  }

  range(100000, 20000000)

})