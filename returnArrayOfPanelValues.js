function returnArrayOfPanelValues() {
  return [    // this array contains the state of the application, including panels, the value of the panels and so on for further manipulation. I didn't create a module becasue it would allow the variable sharing between files
    {
      panel: secondsLeftPanelEL,
      panelValue: secondsLeftPanelEL.textContent,
      set newValue(value) {
        secondsLeftPanelEL.textContent = value
        this.panelValue = value
      },
      panelType: 'seconds'
    },
    {
      panel: minutesLeftPanelEL,
      panelValue: minutesLeftPanelEL.textContent,
      set newValue(value) {
        minutesLeftPanelEL.textContent = value
        this.panelValue = value
      },
      panelType: 'minutes'
    },
    {
      panel: hoursLeftPanelEL,
      panelValue: hoursLeftPanelEL.textContent,
      set newValue(value) {
        hoursLeftPanelEL.textContent = value
        this.panelValue = value
      },
      panelType: 'hours'
    },
    {
      panel: daysLeftPanelSpanEL,
      panelValue: daysLeftPanelSpanEL.textContent,
      set newValue(value) {
        daysLeftPanelSpanEL.textContent = value
        this.panelValue = value
      },
      panelType: 'days'
    }
  ]
}
