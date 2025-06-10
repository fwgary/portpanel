document.addEventListener("DOMContentLoaded", async () => {
  // Fetch theme colors from API
  try {
    const response = await fetch("/api/theme")
    if (response.ok) {
      const theme = await response.json()
      applyTheme(theme)
    } else {
      console.error("Failed to load theme")
    }
  } catch (error) {
    console.error("Error loading theme:", error)
  }

  // Also fetch loader settings
  try {
    const response = await fetch("/api/loader")
    if (response.ok) {
      const loaderSettings = await response.json()
      applyLoaderSettings(loaderSettings)
    }
  } catch (error) {
    console.error("Error loading loader settings:", error)
  }
})

// Apply theme colors to CSS variables
function applyTheme(theme) {
  const root = document.documentElement

  if (theme.primaryColor) {
    const [r, g, b] = theme.primaryColor.split(",").map((val) => val.trim())
    root.style.setProperty("--primary-color-r", r)
    root.style.setProperty("--primary-color-g", g)
    root.style.setProperty("--primary-color-b", b)
  }

  if (theme.secondaryColor) {
    const [r, g, b] = theme.secondaryColor.split(",").map((val) => val.trim())
    root.style.setProperty("--secondary-color-r", r)
    root.style.setProperty("--secondary-color-g", g)
    root.style.setProperty("--secondary-color-b", b)
  }

  if (theme.backgroundColor) {
    const [r, g, b] = theme.backgroundColor.split(",").map((val) => val.trim())
    root.style.setProperty("--background-color-r", r)
    root.style.setProperty("--background-color-g", g)
    root.style.setProperty("--background-color-b", b)

    // Apply background color to body
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`

    // Apply to hero background if it exists
    const heroBackground = document.querySelector(".hero-background")
    if (heroBackground) {
      heroBackground.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    }

    // Apply to loading screen if it exists
    const loadingScreen = document.querySelector(".loading-screen")
    if (loadingScreen) {
      loadingScreen.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    }

    // Calculate brightness to determine text color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    const textColor = brightness < 128 ? "white" : "var(--gray-800)"

    // Apply text color to elements that should adapt
    const adaptiveTextElements = document.querySelectorAll(".adaptive-text")
    adaptiveTextElements.forEach((el) => {
      el.style.color = textColor
    })
  }

  if (theme.backgroundColorPrimary) {
    const [r, g, b] = theme.backgroundColorPrimary.split(",").map((val) => val.trim())
    root.style.setProperty("--background-primary-r", r)
    root.style.setProperty("--background-primary-g", g)
    root.style.setProperty("--background-primary-b", b)

    // Apply to elements with background-primary class
    const primaryBgElements = document.querySelectorAll(".bg-primary")
    primaryBgElements.forEach((el) => {
      el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    })
  }

  if (theme.backgroundColorSecondary) {
    const [r, g, b] = theme.backgroundColorSecondary.split(",").map((val) => val.trim())
    root.style.setProperty("--background-secondary-r", r)
    root.style.setProperty("--background-secondary-g", g)
    root.style.setProperty("--background-secondary-b", b)

    // Apply to elements with background-secondary class
    const secondaryBgElements = document.querySelectorAll(".bg-secondary")
    secondaryBgElements.forEach((el) => {
      el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    })

    // Calculate brightness to determine text color for secondary background
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    const textColor = brightness < 128 ? "white" : "var(--gray-800)"

    // Apply secondary background color to project cards, contact form, etc.
    const projectCards = document.querySelectorAll(".project-card, .contact-info, .contact-form")
    projectCards.forEach((card) => {
      card.style.backgroundColor = `rgb(${r}, ${g}, ${b})`

      // Apply text color to all text elements inside the card
      const textElements = card.querySelectorAll("h3, p, .project-title, .project-description, .project-category")
      textElements.forEach((el) => {
        el.style.color = textColor
      })

      // Apply text color to project links if they exist
      const projectLinks = card.querySelectorAll(".project-link, a")
      projectLinks.forEach((link) => {
        if (brightness < 128) {
          link.style.color = "rgba(255, 255, 255, 0.9)"
        } else {
          link.style.color = "" // Reset to default (secondary color)
        }
      })

      // Apply text color to action buttons
      const actionButtons = card.querySelectorAll(".action-btn")
      actionButtons.forEach((btn) => {
        if (brightness < 128) {
          btn.style.color = "rgba(255, 255, 255, 0.9)"
          btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
        } else {
          btn.style.color = ""
          btn.style.backgroundColor = ""
        }
      })
    })

    // Apply to loader preview background
    const loaderPreview = document.querySelector(".loader-preview")
    if (loaderPreview) {
      loaderPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`

      // Apply text color to loader preview text
      if (brightness < 128) {
        loaderPreview.style.color = "white"
      } else {
        loaderPreview.style.color = "var(--gray-800)"
      }
    }

    // Apply to header when scrolled
    const header = document.querySelector(".header")
    if (header) {
      if (header.classList.contains("scrolled")) {
        header.style.backgroundColor = `rgb(${r}, ${g}, ${b})`

        // Apply text color to nav links
        const navLinks = header.querySelectorAll(".nav-links a")
        navLinks.forEach((link) => {
          link.style.color = textColor
        })

        // Apply text color to logo
        const logo = header.querySelector(".logo-text")
        if (logo) {
          logo.style.color = textColor
        }
      }

      // Add event listener to update header color when scrolled
      window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
          header.style.backgroundColor = `rgb(${r}, ${g}, ${b})`

          // Apply text color to nav links
          const navLinks = header.querySelectorAll(".nav-links a")
          navLinks.forEach((link) => {
            link.style.color = textColor
          })

          // Apply text color to logo
          const logo = header.querySelector(".logo-text")
          if (logo) {
            logo.style.color = textColor
          }
        } else {
          header.style.backgroundColor = "transparent"

          // Reset nav links color
          const navLinks = header.querySelectorAll(".nav-links a")
          navLinks.forEach((link) => {
            link.style.color = ""
          })

          // Reset logo color
          const logo = header.querySelector(".logo-text")
          if (logo) {
            logo.style.color = ""
          }
        }
      })
    }
  }
}

// Apply loader settings
function applyLoaderSettings(settings) {
  // Apply to loading screen if it exists
  const loadingScreen = document.querySelector(".loading-screen")
  if (!loadingScreen) return

  // Clear existing loader
  loadingScreen.innerHTML = ""

  // Create loader container
  const loaderContainer = document.createElement("div")
  loaderContainer.className = "loader"

  // Determine color based on color type
  let color
  if (settings.colorType === "primary") {
    const r = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-r").trim()
    const g = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-g").trim()
    const b = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-b").trim()
    color = `rgb(${r}, ${g}, ${b})`
  } else if (settings.colorType === "secondary") {
    const r = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-r").trim()
    const g = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-g").trim()
    const b = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-b").trim()
    color = `rgb(${r}, ${g}, ${b})`
  } else {
    color = `rgb(${settings.customColor})`
  }

  // Create loader based on type
  let loaderElement

  switch (settings.type) {
    case "spinner":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-spinner"
      break

    case "dots":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-dots"
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div")
        dot.className = "dot"
        loaderElement.appendChild(dot)
      }
      break

    case "circle":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-circle"
      break

    case "bar":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-bar"
      break

    case "pulse":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-pulse"
      break

    case "wave":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-wave"
      for (let i = 0; i < 5; i++) {
        const bar = document.createElement("div")
        bar.className = "bar"
        loaderElement.appendChild(bar)
      }
      break

    case "cube":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-cube"
      for (let i = 0; i < 6; i++) {
        const face = document.createElement("div")
        face.className = "face"
        loaderElement.appendChild(face)
      }
      break

    case "ripple":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-ripple"
      for (let i = 0; i < 2; i++) {
        const div = document.createElement("div")
        loaderElement.appendChild(div)
      }
      break

    case "glowing-loop":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-glowing-loop"
      break

    case "infinity":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-infinity"
      break

    case "heart":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-heart"
      break

    case "grid":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-grid"
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div")
        cell.className = "cell"
        loaderElement.appendChild(cell)
      }
      break

    case "clock":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-clock"
      const hourHand = document.createElement("div")
      hourHand.className = "hour"
      const minuteHand = document.createElement("div")
      minuteHand.className = "minute"
      const secondHand = document.createElement("div")
      secondHand.className = "second"
      loaderElement.appendChild(hourHand)
      loaderElement.appendChild(minuteHand)
      loaderElement.appendChild(secondHand)
      break

    case "flip":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-flip"
      break

    case "hourglass":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-hourglass"
      break

    case "orbit":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-orbit"
      for (let i = 0; i < 3; i++) {
        const orbit = document.createElement("div")
        orbit.className = "orbit"
        loaderElement.appendChild(orbit)
      }
      break

    case "newton":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-newton"
      for (let i = 0; i < 5; i++) {
        const ball = document.createElement("div")
        ball.className = "ball"
        loaderElement.appendChild(ball)
      }
      break

    case "bubble":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-bubble"
      for (let i = 0; i < 8; i++) {
        const bubble = document.createElement("div")
        bubble.className = "bubble"
        bubble.style.animationDelay = `${i * 0.1}s`
        loaderElement.appendChild(bubble)
      }
      break

    case "square":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-square"
      break

    case "dots-circle":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-dots-circle"
      for (let i = 0; i < 8; i++) {
        const dot = document.createElement("div")
        dot.className = "dot"
        dot.style.transform = `rotate(${i * 45}deg)`
        dot.style.animationDelay = `${i * 0.1}s`
        loaderElement.appendChild(dot)
      }
      break

    case "gear":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-gear"
      const innerGear = document.createElement("div")
      innerGear.className = "inner-gear"
      loaderElement.appendChild(innerGear)
      break

    case "bounce":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-bounce"
      for (let i = 0; i < 3; i++) {
        const bounce = document.createElement("div")
        bounce.className = "bounce"
        bounce.style.animationDelay = `${i * 0.2}s`
        loaderElement.appendChild(bounce)
      }
      break

    case "dna":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-dna"
      for (let i = 0; i < 10; i++) {
        const bar1 = document.createElement("div")
        bar1.className = "bar-left"
        bar1.style.top = `${i * 5}px`
        bar1.style.animationDelay = `${i * 0.05}s`

        const bar2 = document.createElement("div")
        bar2.className = "bar-right"
        bar2.style.top = `${i * 5}px`
        bar2.style.animationDelay = `${i * 0.05}s`

        loaderElement.appendChild(bar1)
        loaderElement.appendChild(bar2)
      }
      break

    case "rings":
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-rings"
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement("div")
        ring.className = "ring"
        loaderElement.appendChild(ring)
      }
      break

    default:
      loaderElement = document.createElement("div")
      loaderElement.className = "loader-spinner"
  }

  // Apply size and color
  loaderElement.style.width = `${settings.size}px`
  loaderElement.style.height = `${settings.size}px`

  // Apply animation speed
  loaderElement.style.animationDuration = `${settings.speed}s`

  // Apply color based on loader type
  if (settings.type === "spinner") {
    loaderElement.style.borderColor = `rgba(${color.match(/\d+/g)[0]}, ${color.match(/\d+/g)[1]}, ${color.match(/\d+/g)[2]}, 0.2)`
    loaderElement.style.borderTopColor = color
  } else if (settings.type === "dots" || settings.type === "wave") {
    Array.from(loaderElement.children).forEach((child) => {
      child.style.backgroundColor = color
    })
  } else if (settings.type === "circle") {
    loaderElement.style.borderTopColor = color
    loaderElement.style.setProperty("--loader-color", color)
  } else if (settings.type === "bar") {
    loaderElement.style.backgroundColor = `rgba(${color.match(/\d+/g)[0]}, ${color.match(/\d+/g)[1]}, ${color.match(/\d+/g)[2]}, 0.2)`
    loaderElement.style.setProperty("--loader-color", color)
  } else if (settings.type === "cube") {
    Array.from(loaderElement.children).forEach((face) => {
      face.style.backgroundColor = `rgba(${color.match(/\d+/g)[0]}, ${color.match(/\d+/g)[1]}, ${color.match(/\d+/g)[2]}, 0.8)`
      face.style.borderColor = color
    })
  } else if (settings.type === "ripple") {
    Array.from(loaderElement.children).forEach((div) => {
      div.style.borderColor = color
    })
  } else if (settings.type === "glowing-loop") {
    loaderElement.style.borderColor = `rgba(${color.match(/\d+/g)[0]}, ${color.match(/\d+/g)[1]}, ${color.match(/\d+/g)[2]}, 0.1)`
    loaderElement.style.borderTopColor = color
    loaderElement.style.boxShadow = `0 0 10px ${color}, inset 0 0 5px ${color}`
  } else if (
    settings.type === "grid" ||
    settings.type === "dots-circle" ||
    settings.type === "bounce" ||
    settings.type === "bubble"
  ) {
    Array.from(loaderElement.children).forEach((child) => {
      child.style.backgroundColor = color
    })
  } else if (settings.type === "heart") {
    loaderElement.style.backgroundColor = color
  } else if (settings.type === "clock") {
    loaderElement.style.borderColor = color
    Array.from(loaderElement.children).forEach((hand) => {
      hand.style.backgroundColor = color
    })
  } else if (settings.type === "hourglass") {
    loaderElement.style.borderBottomColor = color
  } else if (settings.type === "orbit" || settings.type === "rings") {
    Array.from(loaderElement.children).forEach((orbit) => {
      orbit.style.borderColor = color
      if (settings.type === "rings") {
        orbit.style.borderBottomColor = color
      }
    })
  } else if (settings.type === "newton") {
    Array.from(loaderElement.children).forEach((ball) => {
      ball.style.backgroundColor = color
    })
  } else if (settings.type === "dna") {
    Array.from(loaderElement.children).forEach((bar) => {
      bar.style.backgroundColor = color
    })
  } else if (settings.type === "gear") {
    loaderElement.style.borderColor = color
    if (loaderElement.firstChild) {
      loaderElement.firstChild.style.borderColor = color
    }
  } else {
    loaderElement.style.backgroundColor = color
  }

  // Add loader to container
  loaderContainer.appendChild(loaderElement)

  // Add text if enabled
  if (settings.showText) {
    const textElement = document.createElement("div")
    textElement.className = "loading-text"
    textElement.textContent = settings.text
    textElement.style.color = color
    loaderContainer.appendChild(textElement)
  }

  // Add to loading screen
  loadingScreen.appendChild(loaderContainer)

  // Apply button loader style
  const btnLoaders = document.querySelectorAll(".btn-loader")
  btnLoaders.forEach((loader) => {
    loader.innerHTML = ""

    if (settings.buttonType === "dots") {
      loader.className = "btn-loader dots"
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div")
        dot.className = "dot"
        loader.appendChild(dot)
      }
    } else if (settings.buttonType === "pulse") {
      loader.className = "btn-loader pulse"
    } else {
      loader.className = "btn-loader spinner"
    }
  })
}
