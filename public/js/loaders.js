// Loader functionality
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const saveLoaderBtn = document.getElementById("save-loader-btn")
  const loaderType = document.getElementById("loader-type")
  const loaderSize = document.getElementById("loader-size")
  const loaderSizeValue = document.getElementById("loader-size-value")
  const loaderSpeed = document.getElementById("loader-speed")
  const loaderSpeedValue = document.getElementById("loader-speed-value")
  const loaderColorType = document.getElementById("loader-color-type")
  const loaderColorR = document.getElementById("loader-color-r")
  const loaderColorG = document.getElementById("loader-color-g")
  const loaderColorB = document.getElementById("loader-color-b")
  const loaderColorPreview = document.getElementById("loader-color-preview")
  const loaderText = document.getElementById("loader-text")
  const loaderShowText = document.getElementById("loader-show-text")
  const loaderDisplay = document.getElementById("loader-display")
  const buttonLoaderType = document.getElementById("button-loader-type")
  const buttonLoaderPreview = document.getElementById("button-loader-preview")
  const loaderCustomColor = document.querySelector(".loader-custom-color")
  const loaderPreview = document.querySelector(".loader-preview")
  const loadingScreen = document.querySelector(".loading-screen")

  // Load loader settings
  loadLoaderSettings()

  // Add event listeners for loader settings
  if (loaderType) {
    loaderType.addEventListener("change", updateLoaderPreview)
  }

  if (loaderSize) {
    loaderSize.addEventListener("input", function () {
      loaderSizeValue.textContent = this.value
      updateLoaderPreview()
    })
  }

  if (loaderSpeed) {
    loaderSpeed.addEventListener("input", function () {
      loaderSpeedValue.textContent = this.value
      updateLoaderPreview()
    })
  }

  if (loaderColorType) {
    loaderColorType.addEventListener("change", function () {
      if (this.value === "custom") {
        loaderCustomColor.style.display = "block"
      } else {
        loaderCustomColor.style.display = "none"
      }
      updateLoaderPreview()
    })
  }

  if (loaderColorR) {
    loaderColorR.addEventListener("input", updateLoaderColorPreview)
  }

  if (loaderColorG) {
    loaderColorG.addEventListener("input", updateLoaderColorPreview)
  }

  if (loaderColorB) {
    loaderColorB.addEventListener("input", updateLoaderColorPreview)
  }

  if (loaderText) {
    loaderText.addEventListener("input", updateLoaderPreview)
  }

  if (loaderShowText) {
    loaderShowText.addEventListener("change", updateLoaderPreview)
  }

  if (buttonLoaderType) {
    buttonLoaderType.addEventListener("change", updateButtonLoaderPreview)
  }

  // Save loader settings
  if (saveLoaderBtn) {
    saveLoaderBtn.addEventListener("click", saveLoaderSettings)
  }

  // Load loader settings
  async function loadLoaderSettings() {
    try {
      const response = await fetch("/api/loader")

      if (!response.ok) {
        throw new Error("Failed to load loader settings")
      }

      const settings = await response.json()

      // Set form values
      if (loaderType) loaderType.value = settings.type || "spinner"
      if (loaderSize) {
        loaderSize.value = settings.size || "50"
        if (loaderSizeValue) loaderSizeValue.textContent = settings.size || "50"
      }
      if (loaderSpeed) {
        loaderSpeed.value = settings.speed || "1"
        if (loaderSpeedValue) loaderSpeedValue.textContent = settings.speed || "1"
      }
      if (loaderColorType) loaderColorType.value = settings.colorType || "primary"

      if (settings.colorType === "custom" && settings.customColor) {
        const [r, g, b] = settings.customColor.split(",").map((val) => val.trim())
        if (loaderColorR) loaderColorR.value = r || "0"
        if (loaderColorG) loaderColorG.value = g || "0"
        if (loaderColorB) loaderColorB.value = b || "0"
        if (loaderColorPreview) loaderColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
        if (loaderCustomColor) loaderCustomColor.style.display = "block"
      } else {
        if (loaderCustomColor) loaderCustomColor.style.display = "none"
      }

      if (loaderText) loaderText.value = settings.text || "Loading..."
      if (loaderShowText) loaderShowText.checked = settings.showText !== false
      if (buttonLoaderType) buttonLoaderType.value = settings.buttonType || "spinner"

      // Update preview
      updateLoaderPreview()
      updateButtonLoaderPreview()
    } catch (error) {
      console.error("Error loading loader settings:", error)
    }
  }

  // Save loader settings
  async function saveLoaderSettings() {
    if (!saveLoaderBtn) return

    // Show loading state
    saveLoaderBtn.classList.add("loading")
    saveLoaderBtn.disabled = true

    try {
      const settings = {
        type: loaderType ? loaderType.value : "spinner",
        size: loaderSize ? loaderSize.value : "50",
        speed: loaderSpeed ? loaderSpeed.value : "1",
        colorType: loaderColorType ? loaderColorType.value : "primary",
        customColor: `${loaderColorR ? loaderColorR.value : "0"}, ${loaderColorG ? loaderColorG.value : "0"}, ${loaderColorB ? loaderColorB.value : "0"}`,
        text: loaderText ? loaderText.value : "Loading...",
        showText: loaderShowText ? loaderShowText.checked : true,
        buttonType: buttonLoaderType ? buttonLoaderType.value : "spinner",
      }

      const response = await fetch("/api/loader", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save loader settings")
      }

      // Show success message
      alert("Loader settings saved successfully!")

      // Update loading screen
      updateLoadingScreen()
    } catch (error) {
      console.error("Error saving loader settings:", error)
      alert("An error occurred. Please try again.")
    } finally {
      // Remove loading state
      saveLoaderBtn.classList.remove("loading")
      saveLoaderBtn.disabled = false
    }
  }

  // Get color based on color type
  function getLoaderColor() {
    const colorType = loaderColorType ? loaderColorType.value : "primary"

    if (colorType === "primary") {
      const r = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-r").trim() || "0"
      const g = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-g").trim() || "0"
      const b = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-b").trim() || "0"
      return { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` }
    } else if (colorType === "secondary") {
      const r = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-r").trim() || "0"
      const g = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-g").trim() || "0"
      const b = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-b").trim() || "0"
      return { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` }
    } else {
      const r = loaderColorR ? loaderColorR.value : "0"
      const g = loaderColorG ? loaderColorG.value : "0"
      const b = loaderColorB ? loaderColorB.value : "0"
      return { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` }
    }
  }

  // Update loader preview
  function updateLoaderPreview() {
    if (!loaderDisplay) return

    // Get values
    const type = loaderType ? loaderType.value : "spinner"
    const size = loaderSize ? loaderSize.value : "50"
    const speed = loaderSpeed ? loaderSpeed.value : "1"
    const showText = loaderShowText ? loaderShowText.checked : true
    const text = loaderText ? loaderText.value : "Loading..."
    const color = getLoaderColor()

    // Get background color for loader preview
    if (loaderPreview) {
      const bgR =
        getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-r").trim() || "245"
      const bgG =
        getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-g").trim() || "245"
      const bgB =
        getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-b").trim() || "245"
      loaderPreview.style.backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`
    }

    // Clear previous loader
    loaderDisplay.innerHTML = ""

    // Create loader element based on type
    const loaderElement = createLoaderElement(type, color, size, speed)
    loaderDisplay.appendChild(loaderElement)

    // Add text if enabled
    if (showText) {
      const textElement = document.createElement("div")
      textElement.className = "loading-text"
      textElement.textContent = text
      textElement.style.color = color.rgb
      textElement.style.marginTop = "10px"
      loaderDisplay.appendChild(textElement)
    }

    // Update loading screen
    updateLoadingScreen()
  }

  // Create loader element based on type
  function createLoaderElement(type, color, size, speed) {
    const container = document.createElement("div")

    switch (type) {
      case "spinner":
        container.className = "loader-spinner"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.borderColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`
        container.style.borderTopColor = color.rgb
        container.style.animationDuration = `${speed}s`
        break

      case "dots":
        container.className = "loader-dots"
        for (let i = 0; i < 3; i++) {
          const dot = document.createElement("div")
          dot.className = "dot"
          dot.style.backgroundColor = color.rgb
          dot.style.animationDuration = `${speed}s`
          container.appendChild(dot)
        }
        break

      case "circle":
        container.className = "loader-circle"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.borderColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`

        const circleBefore = document.createElement("div")
        circleBefore.style.position = "absolute"
        circleBefore.style.top = "-5px"
        circleBefore.style.left = "-5px"
        circleBefore.style.width = `${size}px`
        circleBefore.style.height = `${size}px`
        circleBefore.style.borderRadius = "50%"
        circleBefore.style.border = "5px solid transparent"
        circleBefore.style.borderTopColor = color.rgb
        circleBefore.style.animation = `spin ${speed}s linear infinite`

        container.appendChild(circleBefore)
        break

      case "bar":
        container.className = "loader-bar"
        container.style.width = `${size * 4}px`
        container.style.height = `${size / 5}px`
        container.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`

        const barAfter = document.createElement("div")
        barAfter.style.position = "absolute"
        barAfter.style.top = "0"
        barAfter.style.left = "0"
        barAfter.style.height = "100%"
        barAfter.style.width = "0"
        barAfter.style.backgroundColor = color.rgb
        barAfter.style.animation = `progress ${speed * 2}s infinite`

        container.appendChild(barAfter)
        break

      case "pulse":
        container.className = "loader-pulse"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.backgroundColor = color.rgb
        container.style.animationDuration = `${speed}s`
        break

      case "wave":
        container.className = "loader-wave"
        for (let i = 0; i < 5; i++) {
          const bar = document.createElement("div")
          bar.className = "bar"
          bar.style.backgroundColor = color.rgb
          bar.style.animationDuration = `${speed}s`
          bar.style.animationDelay = `-${speed * (1 - i * 0.1)}s`
          container.appendChild(bar)
        }
        break

      case "cube":
        container.className = "loader-cube"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.animationDuration = `${speed * 2}s`

        for (let i = 0; i < 6; i++) {
          const face = document.createElement("div")
          face.className = "face"
          face.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`
          face.style.borderColor = color.rgb
          container.appendChild(face)
        }
        break

      case "ripple":
        container.className = "loader-ripple"
        container.style.width = `${size}px`
        container.style.height = `${size}px`

        for (let i = 0; i < 2; i++) {
          const div = document.createElement("div")
          div.style.borderColor = color.rgb
          div.style.animationDuration = `${speed * 1.5}s`
          if (i === 1) {
            div.style.animationDelay = `-${speed * 0.5}s`
          }
          container.appendChild(div)
        }
        break

      case "glowing-loop":
        container.className = "loader-glowing-loop"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.borderColor = "transparent"
        container.style.borderTopColor = color.rgb
        container.style.boxShadow = `0 0 10px ${color.rgb}, inset 0 0 5px ${color.rgb}`
        container.style.animationDuration = `${speed}s`
        break

      case "infinity":
        container.className = "loader-infinity"
        container.style.width = `${size}px`
        container.style.height = `${size / 2}px`
        container.style.position = "relative"

        const leftLoop = document.createElement("div")
        leftLoop.style.position = "absolute"
        leftLoop.style.left = "0"
        leftLoop.style.width = `${size / 2}px`
        leftLoop.style.height = `${size / 2}px`
        leftLoop.style.borderRadius = "50%"
        leftLoop.style.border = `4px solid ${color.rgb}`
        leftLoop.style.animation = `infinity ${speed * 1.5}s infinite`

        const rightLoop = document.createElement("div")
        rightLoop.style.position = "absolute"
        rightLoop.style.right = "0"
        rightLoop.style.width = `${size / 2}px`
        rightLoop.style.height = `${size / 2}px`
        rightLoop.style.borderRadius = "50%"
        rightLoop.style.border = `4px solid ${color.rgb}`
        rightLoop.style.animation = `infinity ${speed * 1.5}s infinite`
        rightLoop.style.animationDelay = `-${speed * 0.75}s`

        container.appendChild(leftLoop)
        container.appendChild(rightLoop)
        break

      case "heart":
        container.className = "loader-heart"
        container.style.width = `${size}px`
        container.style.height = `${size * 0.9}px`
        container.style.backgroundColor = color.rgb
        container.style.transform = "rotate(45deg)"
        container.style.animation = `heart ${speed * 1.2}s infinite`
        container.style.position = "relative"

        const leftLobe = document.createElement("div")
        leftLobe.style.position = "absolute"
        leftLobe.style.top = `-${size * 0.3}px`
        leftLobe.style.left = "0"
        leftLobe.style.width = `${size * 0.6}px`
        leftLobe.style.height = `${size * 0.6}px`
        leftLobe.style.backgroundColor = color.rgb
        leftLobe.style.borderRadius = "50%"

        const rightLobe = document.createElement("div")
        rightLobe.style.position = "absolute"
        rightLobe.style.top = "0"
        rightLobe.style.left = `-${size * 0.3}px`
        rightLobe.style.width = `${size * 0.6}px`
        rightLobe.style.height = `${size * 0.6}px`
        rightLobe.style.backgroundColor = color.rgb
        rightLobe.style.borderRadius = "50%"

        container.appendChild(leftLobe)
        container.appendChild(rightLobe)
        break

      case "grid":
        container.className = "loader-grid"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.display = "grid"
        container.style.gridTemplateColumns = "repeat(3, 1fr)"
        container.style.gridGap = "2px"

        for (let i = 0; i < 9; i++) {
          const cell = document.createElement("div")
          cell.className = "cell"
          cell.style.width = `${size / 3 - 2}px`
          cell.style.height = `${size / 3 - 2}px`
          cell.style.backgroundColor = color.rgb
          cell.style.animationDuration = `${speed * 1.5}s`
          cell.style.animationDelay = `${i * speed * 0.1}s`
          container.appendChild(cell)
        }
        break

      case "clock":
        container.className = "loader-clock"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.borderColor = color.rgb

        const hourHand = document.createElement("div")
        hourHand.className = "hour"
        hourHand.style.backgroundColor = color.rgb
        hourHand.style.width = "2px"
        hourHand.style.height = `${size * 0.3}px`
        hourHand.style.position = "absolute"
        hourHand.style.top = "50%"
        hourHand.style.left = "50%"
        hourHand.style.marginLeft = "-1px"
        hourHand.style.marginTop = `-${size * 0.3}px`
        hourHand.style.transformOrigin = "bottom center"
        hourHand.style.animation = `clock-hour ${speed * 6}s linear infinite`

        const minuteHand = document.createElement("div")
        minuteHand.className = "minute"
        minuteHand.style.backgroundColor = color.rgb
        minuteHand.style.width = "2px"
        minuteHand.style.height = `${size * 0.4}px`
        minuteHand.style.position = "absolute"
        minuteHand.style.top = "50%"
        minuteHand.style.left = "50%"
        minuteHand.style.marginLeft = "-1px"
        minuteHand.style.marginTop = `-${size * 0.4}px`
        minuteHand.style.transformOrigin = "bottom center"
        minuteHand.style.animation = `clock-minute ${speed}s linear infinite`

        const secondHand = document.createElement("div")
        secondHand.className = "second"
        secondHand.style.backgroundColor = color.rgb
        secondHand.style.width = "1px"
        secondHand.style.height = `${size * 0.45}px`
        secondHand.style.position = "absolute"
        secondHand.style.top = "50%"
        secondHand.style.left = "50%"
        secondHand.style.marginLeft = "-0.5px"
        secondHand.style.marginTop = `-${size * 0.45}px`
        secondHand.style.transformOrigin = "bottom center"
        secondHand.style.animation = `clock-second ${speed}s linear infinite`

        container.appendChild(hourHand)
        container.appendChild(minuteHand)
        container.appendChild(secondHand)
        break

      case "flip":
        container.className = "loader-flip"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.backgroundColor = color.rgb
        container.style.animation = `flip ${speed * 1.2}s infinite`
        break

      case "hourglass":
        container.className = "loader-hourglass"
        container.style.width = "0"
        container.style.height = "0"
        container.style.borderLeft = `${size / 2}px solid transparent`
        container.style.borderRight = `${size / 2}px solid transparent`
        container.style.borderBottom = `${size}px solid ${color.rgb}`
        container.style.animation = `hourglass ${speed * 1.5}s infinite`
        break

      case "orbit":
        container.className = "loader-orbit"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.position = "relative"

        for (let i = 0; i < 3; i++) {
          const orbit = document.createElement("div")
          orbit.className = "orbit"
          orbit.style.position = "absolute"

          if (i === 0) {
            orbit.style.width = "100%"
            orbit.style.height = "100%"
            orbit.style.animationDelay = "0s"
          } else if (i === 1) {
            orbit.style.width = "70%"
            orbit.style.height = "70%"
            orbit.style.top = "15%"
            orbit.style.left = "15%"
            orbit.style.animationDelay = `-${speed * 0.5}s`
          } else {
            orbit.style.width = "40%"
            orbit.style.height = "40%"
            orbit.style.top = "30%"
            orbit.style.left = "30%"
            orbit.style.animationDelay = `-${speed}s`
          }

          orbit.style.border = `2px solid ${color.rgb}`
          orbit.style.borderRadius = "50%"
          orbit.style.animation = `orbit ${speed * 1.5}s linear infinite`

          container.appendChild(orbit)
        }
        break

      case "newton":
        container.className = "loader-newton"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.display = "flex"
        container.style.justifyContent = "space-between"
        container.style.alignItems = "flex-end"

        for (let i = 0; i < 5; i++) {
          const ball = document.createElement("div")
          ball.className = "ball"
          ball.style.width = `${size / 6}px`
          ball.style.height = `${size / 6}px`
          ball.style.backgroundColor = color.rgb
          ball.style.borderRadius = "50%"
          ball.style.position = "relative"

          const string = document.createElement("div")
          string.style.position = "absolute"
          string.style.width = "1px"
          string.style.height = `${size / 2}px`
          string.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
          string.style.top = `-${size / 2}px`
          string.style.left = "50%"
          string.style.transform = "translateX(-50%)"

          ball.appendChild(string)

          if (i === 0) {
            ball.style.animation = `newton-left ${speed}s infinite`
          } else if (i === 4) {
            ball.style.animation = `newton-right ${speed}s infinite`
          }

          container.appendChild(ball)
        }
        break

      case "bubble":
        container.className = "loader-bubble"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.position = "relative"

        const positions = [
          { top: 0, left: `${size * 0.4}px` },
          { top: `${size * 0.2}px`, left: `${size * 0.8}px` },
          { top: `${size * 0.5}px`, left: `${size * 0.9}px` },
          { top: `${size * 0.8}px`, left: `${size * 0.8}px` },
          { top: `${size * 0.9}px`, left: `${size * 0.4}px` },
          { top: `${size * 0.8}px`, left: 0 },
          { top: `${size * 0.5}px`, left: `-${size * 0.1}px` },
          { top: `${size * 0.2}px`, left: 0 },
        ]

        for (let i = 0; i < positions.length; i++) {
          const bubble = document.createElement("div")
          bubble.className = "bubble"
          bubble.style.position = "absolute"
          bubble.style.width = `${size * 0.2}px`
          bubble.style.height = `${size * 0.2}px`
          bubble.style.borderRadius = "50%"
          bubble.style.backgroundColor = color.rgb
          bubble.style.top = positions[i].top
          bubble.style.left = positions[i].left
          bubble.style.animation = `bubble ${speed * 1.5}s ease-in-out infinite`
          bubble.style.animationDelay = `${i * speed * 0.1}s`

          container.appendChild(bubble)
        }
        break

      case "square":
        container.className = "loader-square"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.backgroundColor = color.rgb
        container.style.animation = `square ${speed * 1.5}s infinite`
        break

      case "dots-circle":
        container.className = "loader-dots-circle"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.position = "relative"

        const dotPositions = [
          { top: 0, left: "50%", transform: "translateX(-50%)" },
          { top: `${size * 0.146}%`, right: `${size * 0.146}%` },
          { top: "50%", right: 0, transform: "translateY(-50%)" },
          { bottom: `${size * 0.146}%`, right: `${size * 0.146}%` },
          { bottom: 0, left: "50%", transform: "translateX(-50%)" },
          { bottom: `${size * 0.146}%`, left: `${size * 0.146}%` },
          { top: "50%", left: 0, transform: "translateY(-50%)" },
          { top: `${size * 0.146}%`, left: `${size * 0.146}%` },
        ]

        for (let i = 0; i < dotPositions.length; i++) {
          const dot = document.createElement("div")
          dot.className = "dot"
          dot.style.position = "absolute"
          dot.style.width = `${size * 0.16}px`
          dot.style.height = `${size * 0.16}px`
          dot.style.backgroundColor = color.rgb
          dot.style.borderRadius = "50%"
          dot.style.animation = `dots-circle ${speed * 1.2}s linear infinite`
          dot.style.animationDelay = `-${i * speed * 0.15}s`

          // Apply position
          Object.keys(dotPositions[i]).forEach((key) => {
            dot.style[key] = dotPositions[i][key]
          })

          container.appendChild(dot)
        }
        break

      case "gear":
        container.className = "loader-gear"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.borderColor = color.rgb
        container.style.animation = `gear ${speed * 2}s linear infinite`

        const innerGear = document.createElement("div")
        innerGear.className = "inner-gear"
        innerGear.style.position = "absolute"
        innerGear.style.width = `${size / 2}px`
        innerGear.style.height = `${size / 2}px`
        innerGear.style.top = "50%"
        innerGear.style.left = "50%"
        innerGear.style.marginTop = `-${size / 4}px`
        innerGear.style.marginLeft = `-${size / 4}px`
        innerGear.style.borderColor = color.rgb
        innerGear.style.animation = `gear ${speed * 2}s linear infinite reverse`

        container.appendChild(innerGear)
        break

      case "bounce":
        container.className = "loader-bounce"
        container.style.display = "flex"
        container.style.justifyContent = "center"
        container.style.alignItems = "center"
        container.style.gap = "5px"
        container.style.width = `${size}px`
        container.style.height = `${size}px`

        for (let i = 0; i < 3; i++) {
          const bounce = document.createElement("div")
          bounce.className = "bounce"
          bounce.style.width = `${size * 0.24}px`
          bounce.style.height = `${size * 0.24}px`
          bounce.style.borderRadius = "50%"
          bounce.style.backgroundColor = color.rgb
          bounce.style.animation = `bounce-up ${speed * 0.6}s infinite alternate`
          bounce.style.animationDelay = `${i * speed * 0.2}s`

          container.appendChild(bounce)
        }
        break

      case "dna":
        container.className = "loader-dna"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.position = "relative"
        container.style.transform = "rotate(90deg)"

        for (let i = 0; i < 10; i++) {
          const barLeft = document.createElement("div")
          barLeft.className = "bar-left"
          barLeft.style.position = "absolute"
          barLeft.style.width = `${size * 0.16}px`
          barLeft.style.height = `${size * 0.04}px`
          barLeft.style.backgroundColor = color.rgb
          barLeft.style.opacity = "0.8"
          barLeft.style.left = "0"
          barLeft.style.top = `${i * size * 0.1}px`
          barLeft.style.animation = `dna-left ${speed}s infinite`
          barLeft.style.animationDelay = `${i * speed * 0.05}s`

          const barRight = document.createElement("div")
          barRight.className = "bar-right"
          barRight.style.position = "absolute"
          barRight.style.width = `${size * 0.16}px`
          barRight.style.height = `${size * 0.04}px`
          barRight.style.backgroundColor = color.rgb
          barRight.style.opacity = "0.8"
          barRight.style.right = "0"
          barRight.style.top = `${i * size * 0.1}px`
          barRight.style.animation = `dna-right ${speed}s infinite`
          barRight.style.animationDelay = `${i * speed * 0.05}s`

          container.appendChild(barLeft)
          container.appendChild(barRight)
        }
        break

      case "rings":
        container.className = "loader-rings"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.position = "relative"

        for (let i = 0; i < 3; i++) {
          const ring = document.createElement("div")
          ring.className = "ring"
          ring.style.position = "absolute"

          if (i === 0) {
            ring.style.width = "100%"
            ring.style.height = "100%"
            ring.style.animationDelay = "0s"
          } else if (i === 1) {
            ring.style.width = "70%"
            ring.style.height = "70%"
            ring.style.top = "15%"
            ring.style.left = "15%"
            ring.style.animationDelay = `-${speed * 0.5}s`
          } else {
            ring.style.width = "40%"
            ring.style.height = "40%"
            ring.style.top = "30%"
            ring.style.left = "30%"
            ring.style.animationDelay = `-${speed}s`
          }

          ring.style.border = "4px solid transparent"
          ring.style.borderBottomColor = color.rgb
          ring.style.borderRadius = "50%"
          ring.style.animation = `rings ${speed * 1.5}s linear infinite`

          container.appendChild(ring)
        }
        break

      default:
        container.className = "loader-spinner"
        container.style.width = `${size}px`
        container.style.height = `${size}px`
        container.style.borderColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`
        container.style.borderTopColor = color.rgb
        container.style.animationDuration = `${speed}s`
    }

    return container
  }

  // Update loading screen
  function updateLoadingScreen() {
    if (!loadingScreen) return

    // Get values
    const type = loaderType ? loaderType.value : "spinner"
    const size = loaderSize ? loaderSize.value : "50"
    const speed = loaderSpeed ? loaderSpeed.value : "1"
    const showText = loaderShowText ? loaderShowText.checked : true
    const text = loaderText ? loaderText.value : "Loading..."
    const color = getLoaderColor()

    // Set background color for loading screen
    const bgR = getComputedStyle(document.documentElement).getPropertyValue("--background-color-r").trim() || "245"
    const bgG = getComputedStyle(document.documentElement).getPropertyValue("--background-color-g").trim() || "245"
    const bgB = getComputedStyle(document.documentElement).getPropertyValue("--background-color-b").trim() || "245"
    loadingScreen.style.backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`

    // Clear loading screen
    loadingScreen.innerHTML = ""

    // Create loader container
    const loaderContainer = document.createElement("div")
    loaderContainer.className = "loader"

    // Create loader element
    const loaderElement = createLoaderElement(type, color, size, speed)
    loaderContainer.appendChild(loaderElement)

    // Add text if enabled
    if (showText) {
      const textElement = document.createElement("div")
      textElement.className = "loading-text"
      textElement.textContent = text
      textElement.style.color = color.rgb
      loaderContainer.appendChild(textElement)
    }

    // Add to loading screen
    loadingScreen.appendChild(loaderContainer)
  }

  // Update button loader preview
  function updateButtonLoaderPreview() {
    if (!buttonLoaderPreview) return

    const type = buttonLoaderType ? buttonLoaderType.value : "spinner"

    buttonLoaderPreview.innerHTML = ""
    buttonLoaderPreview.className = `btn-loader ${type}`

    if (type === "dots") {
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div")
        dot.className = "dot"
        buttonLoaderPreview.appendChild(dot)
      }
    }
  }

  // Update loader color preview
  function updateLoaderColorPreview() {
    if (!loaderColorPreview) return

    const r = loaderColorR ? loaderColorR.value : "0"
    const g = loaderColorG ? loaderColorG.value : "0"
    const b = loaderColorB ? loaderColorB.value : "0"
    loaderColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    updateLoaderPreview()
  }
})
