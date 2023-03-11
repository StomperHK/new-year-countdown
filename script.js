const bodyEL = document.querySelector('[data-js="body-element"]')

const daysLeftPanelEL = document.querySelector('[data-js="timer-panels__days-panel"]')
const daysLeftPanelSpanEL = document.querySelector('[data-js="timer-panels__days-panel-span"]')
const hoursLeftPanelEL = document.querySelector('[data-js="timer-panels__hours-panel"]')
const minutesLeftPanelEL = document.querySelector('[data-js="timer-panels__minutes-panel"]')
const secondsLeftPanelEL = document.querySelector('[data-js="timer-panels__seconds-panel"]')


function getDifferenceBetweenDates(initialDate, finalDate) {
  let differenceInMiliseconds = Date.parse(finalDate) - Date.parse(initialDate)
  const daysLeft = Math.floor(differenceInMiliseconds / 86400000)
  differenceInMiliseconds -= daysLeft * 86400000
  const hoursLeft = Math.floor(differenceInMiliseconds / 3600000)
  differenceInMiliseconds -= hoursLeft * 3600000
  const minutesLeft = Math.floor(differenceInMiliseconds / 60000)
  differenceInMiliseconds -= minutesLeft * 60000
  const secondsLeft = Math.floor(differenceInMiliseconds / 1000)

  return {
    daysLeft: daysLeft,
    hoursLeft: hoursLeft,
    minutesLeft: minutesLeft,
    secondsLeft: secondsLeft
  }
}

function padValue(value) {
  return String(value).padStart(2, '0')
}

function removeUnitPlural(panel, panelText, index) {
  const panelParagraphEL = index !== 3 ? panel.parentElement.querySelector('p') : panel.parentElement.parentElement.querySelector('p')    // I had to do this because, on panel of hours, using parentElement wasn't return the <p>
  const paragraphPluralSpanEL = panelParagraphEL.children[0]

  if (panelText === "01") {
    panelParagraphEL.classList.add('move-paragraph-to-right')
    paragraphPluralSpanEL.classList.add('hide-element')
  }
  else {
    panelParagraphEL.classList.remove('move-paragraph-to-right')
    paragraphPluralSpanEL.classList.remove('hide-element')
  }
}

function getAmountOfDaysBasedOnLeapYear() {
  const year = new Date().getFullYear()

  if (year % 4 === 0 && year % 100 === 0 && year % 400 === 0) {
    return '365'
  }
  else if (year % 4 === 0 && year % 100 !== 0) {
    return '365'
  }
  else {
    return '364'
  }
}

function updateTimer() {
  const arrayOfPanelsAndAssociatedValues = [
    {
      panel: secondsLeftPanelEL,
      panelValue: secondsLeftPanelEL.textContent
    },
    {
      panel: minutesLeftPanelEL,
      panelValue: minutesLeftPanelEL.textContent
    },
    {
      panel: hoursLeftPanelEL,
      panelValue: hoursLeftPanelEL.textContent
    },
    {
      panel: daysLeftPanelSpanEL,
      panelValue: daysLeftPanelSpanEL.textContent
    }
  ]

  arrayOfPanelsAndAssociatedValues.forEach((element, index) => {   // Basicly this function is updating the timer, checking if any panel is currently with the value "00", if so the value of the current panel is restarted to 59
    const {panel, panelValue} = element
    const theCurrentElementAreTheSeconds = index === 0
    const theCurrentElementAreTheMinutes = index === 1
    const theCurrentElementAreTheHours = index === 2
    const theCurrentPanelValueIsNotZero = panelValue !== '00'

    if (theCurrentElementAreTheSeconds) {
      if (theCurrentPanelValueIsNotZero) {
        panel.textContent = String(panelValue - 1).padStart(2, '0')
      }
      else {
        panel.textContent = '59'
      }
    }

    else if (theCurrentElementAreTheMinutes) {
      const theSecondsPanelValueIsZero = arrayOfPanelsAndAssociatedValues[index-1].panelValue === '00'

      if (theSecondsPanelValueIsZero && theCurrentPanelValueIsNotZero) {
        panel.textContent = String(panelValue - 1).padStart(2, '0')
      }
      else if (theSecondsPanelValueIsZero && !theCurrentPanelValueIsNotZero) {
        panel.textContent = '59'
      }
    }

    else if (theCurrentElementAreTheHours) {
      const theMinutesPanelValueIsZero = arrayOfPanelsAndAssociatedValues[index-1].panelValue === '00'
      const theSecondsPanelValueIsZero = arrayOfPanelsAndAssociatedValues[index-2].panelValue === '00'

      if (theMinutesPanelValueIsZero && theSecondsPanelValueIsZero && theCurrentPanelValueIsNotZero) {
        panel.textContent = String(panelValue - 1).padStart(2, '0')
      }
      else if (theMinutesPanelValueIsZero && theSecondsPanelValueIsZero && !theCurrentPanelValueIsNotZero) {
        panel.textContent = '23'
      }
    }

    else {
      const theHoursPanelValueIsZero = arrayOfPanelsAndAssociatedValues[index-1].panelValue === '00'
      const theMinutesPanelValueIsZero = arrayOfPanelsAndAssociatedValues[index-2].panelValue === '00'
      const theSecondsPanelValueIsZero = arrayOfPanelsAndAssociatedValues[index-3].panelValue === '00'

      if (theHoursPanelValueIsZero && theMinutesPanelValueIsZero && theSecondsPanelValueIsZero && theCurrentPanelValueIsNotZero) {
        panel.textContent = String(panelValue - 1).padStart(2, '0')
      }
      else if (theHoursPanelValueIsZero && theMinutesPanelValueIsZero && theSecondsPanelValueIsZero && !theCurrentPanelValueIsNotZero) {
        panel.textContent = getAmountOfDaysBasedOnLeapYear()
      }

      reducePanelSize(daysLeftPanelSpanEL)
    }

    removeUnitPlural(panel, panel.textContent, index)
  })
}

function startTimer() {
  const currentDate = new Date()
  const newYearDateString = `${currentDate.getFullYear() + 1}-01-01T00:00:00`
  const newYearDate = new Date(`${newYearDateString}`)
  const {daysLeft, hoursLeft, minutesLeft, secondsLeft} = getDifferenceBetweenDates(currentDate, newYearDate)
  
  daysLeftPanelSpanEL.textContent = padValue(daysLeft)
  hoursLeftPanelEL.textContent = padValue(hoursLeft)
  minutesLeftPanelEL.textContent = padValue(minutesLeft)
  secondsLeftPanelEL.textContent = padValue(secondsLeft)

  setInterval(updateTimer, 1000)
}

startTimer()

function reducePanelSize(panel) {
  if (panel.textContent.length === 3) {
    daysLeftPanelEL.classList.add('timer-panels__panel--small')
  }
  else {
    daysLeftPanelEL.classList.remove('timer-panels__panel--small')  
  }
}

reducePanelSize(daysLeftPanelSpanEL)

function startPageAnimation() {
  bodyEL.classList.remove('hide-body-element')
}


window.addEventListener('load', startPageAnimation)
