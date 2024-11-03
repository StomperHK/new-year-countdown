const bodyEL = document.querySelector('[data-js="body-element"]')

const installButtonEL = document.querySelector("[data-js='install-button']")

const progressBarPercentageEL = document.querySelector('[data-js="progress-bar__percentage"]')
const progressBarEL = document.querySelector('[data-js="progress-bar__progress"]')

const daysLeftPanelEL = document.querySelector('[data-js="timer-panels__days-panel"]')
const daysLeftPanelSpanEL = document.querySelector('[data-js="timer-panels__days-panel-span"]')
const hoursLeftPanelEL = document.querySelector('[data-js="timer-panels__hours-panel"]')
const minutesLeftPanelEL = document.querySelector('[data-js="timer-panels__minutes-panel"]')
const secondsLeftPanelEL = document.querySelector('[data-js="timer-panels__seconds-panel"]')

let deferredPrompt = null
let arrayOfPanelsAndAssociatedValues = null   // will get updated after calling startTimer() function



function PWACanBeInstallableCallback(event) {
  event.preventDefault()

  deferredPrompt = event

  installButtonEL.classList.remove("hide-element")
}

async function triggerPWAInstallation() {
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  
  installButtonEL.style.opacity = 0

  deferredPrompt = null 
}

function setProgressBarProgress(daysLeft) {
  const daysOfTheYear = getAmountOfDaysBasedOnLeapYear()
  const passedDays = daysOfTheYear - (daysLeft !== undefined ? daysLeft : daysOfTheYear)
  const progressAsPercentage = passedDays / daysOfTheYear * 100
  
  progressBarEL.style.width = progressAsPercentage + '%'
  progressBarPercentageEL.textContent = (progressAsPercentage === 100 ? 99 : Math.floor(progressAsPercentage)) + '%'
}

function getDifferenceBetweenDates(initialDate, finalDate) {
  let differenceInMiliseconds = Date.parse(finalDate) - Date.parse(initialDate)
  const daysLeft = Math.floor(differenceInMiliseconds / 86400000)
  differenceInMiliseconds %= 86400000
  const hoursLeft = Math.floor(differenceInMiliseconds / 3600000)
  differenceInMiliseconds %= 3600000
  const minutesLeft = Math.floor(differenceInMiliseconds / 60000)
  differenceInMiliseconds %= 60000
  const secondsLeft = Math.floor(differenceInMiliseconds / 1000)

  return {
    daysLeft,
    hoursLeft,
    minutesLeft,
    secondsLeft
  }
}

function padValue(value) {
  return String(value).padStart(2, '0')
}

function removeUnitPlural(panel, updatedPanelValue, panelType) {
  const panelParagraphEL = panelType !== 'days' ? panel.parentElement.querySelector('p') : panel.parentElement.parentElement.querySelector('p')    // I had to do this because, on panel of hours, using parentElement wasn't return the <p>
  const paragraphPluralSpanEL = panelParagraphEL.children[0]

  if (updatedPanelValue === "01") {
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
  let allPreviousValuesReseted = true

  for (element of arrayOfPanelsAndAssociatedValues) {   // Basicly, this function is updating the timer, checking if any panel is currently with the value "00", if so the value of the current panel is restarted to 59
    let {panel, panelValue, panelType} = element
    const theCurrentPanelValueIsNotZero = panelValue !== '00'

    if (panelType === 'seconds') {
      if (theCurrentPanelValueIsNotZero) {
        element.newValue = padValue(panelValue - 1)
        allPreviousValuesReseted = false
      }
      
      else {
        element.newValue = '59'
      }
    }

    else if (panelType === 'minutes') {
      if (allPreviousValuesReseted && theCurrentPanelValueIsNotZero) {
        element.newValue = padValue(panelValue - 1)
        allPreviousValuesReseted = false
      }

      else if (allPreviousValuesReseted && !theCurrentPanelValueIsNotZero) {
        element.newValue = '59'
      }
    }

    else if (panelType === 'hours') {
      if (allPreviousValuesReseted && theCurrentPanelValueIsNotZero) {
        element.newValue = padValue(panelValue - 1)
        allPreviousValuesReseted = false
      }

      else if (allPreviousValuesReseted && !theCurrentPanelValueIsNotZero) {
        element.newValue = '23'
      }
    }

    else {
      if (allPreviousValuesReseted && theCurrentPanelValueIsNotZero) {
        element.newValue = String(--panelValue).padStart(2, '0')
        setProgressBarProgress(panelValue)
      }

      else if (allPreviousValuesReseted && !theCurrentPanelValueIsNotZero) {
        element.newValue = getAmountOfDaysBasedOnLeapYear()
        setProgressBarProgress()
      }

      reducePanelSize(daysLeftPanelSpanEL)
    }

    removeUnitPlural(panel, element.panelValue, panelType)

    if (!allPreviousValuesReseted) return
  }
}

function startTimer() {
  const currentDate = new Date()
  const newYearDateString = `${currentDate.getFullYear() + 1}-01-01T00:00:00`
  const newYearDate = new Date(newYearDateString)
  const {daysLeft, hoursLeft, minutesLeft, secondsLeft} = getDifferenceBetweenDates(currentDate, newYearDate)
  
  daysLeftPanelSpanEL.textContent = padValue(daysLeft)
  hoursLeftPanelEL.textContent = padValue(hoursLeft)
  minutesLeftPanelEL.textContent = padValue(minutesLeft)
  secondsLeftPanelEL.textContent = padValue(secondsLeft)

  setProgressBarProgress(daysLeft)

  setInterval(updateTimer, 1000)

  arrayOfPanelsAndAssociatedValues = returnArrayOfPanelValues()
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



window.addEventListener("beforeinstallprompt", PWACanBeInstallableCallback)

installButtonEL.addEventListener("click", triggerPWAInstallation)

window.addEventListener('load', startPageAnimation)
