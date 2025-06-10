function updatePageTitle() {
  fetch("/api/user")
    .then((response) => response.json())
    .then((userData) => {
      const userName = userData.name?.trim() || "Portfolio"
      document.title = `${userName} - Portfolio`
    })
    .catch((error) => {
      console.error("Error updating title:", error)
      document.title = "Portfolio" // Fallback title
    })
}

// Call when page loads
document.addEventListener("DOMContentLoaded", updatePageTitle)

document.addEventListener("DOMContentLoaded", () => {
  // Loading screen animation
  const loadingScreen = document.querySelector(".loading-screen")
  const hero = document.querySelector(".hero")
  const heroBackground = document.querySelector(".hero-background")

  // Apply background color to hero if available from CSS variables
  if (heroBackground) {
    const r = getComputedStyle(document.documentElement).getPropertyValue("--background-color-r").trim() || "245"
    const g = getComputedStyle(document.documentElement).getPropertyValue("--background-color-g").trim() || "245"
    const b = getComputedStyle(document.documentElement).getPropertyValue("--background-color-b").trim() || "245"

    if (r && g && b) {
      heroBackground.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    }
  }

  // Apply background color to loading screen
  if (loadingScreen) {
    const r = getComputedStyle(document.documentElement).getPropertyValue("--background-color-r").trim() || "245"
    const g = getComputedStyle(document.documentElement).getPropertyValue("--background-color-g").trim() || "245"
    const b = getComputedStyle(document.documentElement).getPropertyValue("--background-color-b").trim() || "245"

    loadingScreen.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
  }

  // Simulate loading (for demo purposes) - FIXED: reduced timeout and added error handling
  setTimeout(() => {
    if (loadingScreen && hero) {
      loadingScreen.classList.add("fade-out")
      hero.classList.add("loaded")

      // Remove loading screen after animation
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.display = "none"
        }
      }, 500)
    } else {
      // If elements don't exist, make sure loading screen is hidden
      if (loadingScreen) {
        loadingScreen.style.display = "none"
      }
      console.warn("Hero or loading screen elements not found")
    }
  }, 1000) // Reduced from 1500ms to 1000ms

  // Header scroll effect
  const header = document.querySelector(".header")

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")

        // Get the background secondary color from CSS variables
        const r =
          getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-r").trim() || "245"
        const g =
          getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-g").trim() || "245"
        const b =
          getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-b").trim() || "245"

        if (r && g && b) {
          header.style.backgroundColor = `rgb(${r}, ${g}, ${b})`

          // Calculate brightness to determine text color
          const brightness = (Number.parseInt(r) * 299 + Number.parseInt(g) * 587 + Number.parseInt(b) * 114) / 1000
          const textColor = brightness < 128 ? "white" : "var(--gray-800)"

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
          header.style.backgroundColor = "var(--white)" // Fallback
        }
      } else {
        header.classList.remove("scrolled")
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

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenuBtn.classList.toggle("active")
      navLinks.classList.toggle("active")
    })

    // Close mobile menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuBtn.classList.remove("active")
        navLinks.classList.remove("active")
      })
    })
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const headerHeight = header ? header.offsetHeight : 0
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Project filtering
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectsContainer = document.getElementById("projects-container")

  // Fetch projects
  if (projectsContainer) {
    fetchProjects()
  }

  // Add click event to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Get filter value
      const filter = button.getAttribute("data-filter")

      // Filter projects
      filterProjects(filter)
    })
  })

  // Scroll animation
  const scrollElements = document.querySelectorAll(".scroll-hidden")

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
  }

  const displayScrollElement = (element) => {
    element.classList.add("scroll-visible")
  }

  const hideScrollElement = (element) => {
    element.classList.remove("scroll-visible")
  }

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el)
      } else {
        hideScrollElement(el)
      }
    })
  }

  window.addEventListener("scroll", () => {
    handleScrollAnimation()
  })

  // Initialize scroll animation
  handleScrollAnimation()

  // Contact form submission
  const contactForm = document.querySelector(".contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // In a real app, you would send the form data to a server
      // For demo, just show a success message
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      }

      console.log("Form submitted:", formData)

      // Reset form
      contactForm.reset()

      // Show success message (in a real app)
      alert("Thank you for your message! I will get back to you soon.")
    })
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // For demo purposes only
      const email = newsletterForm.querySelector('input[type="email"]').value
      console.log("Newsletter subscription:", email)

      // Reset form
      newsletterForm.reset()

      // Show success message (in a real app)
      alert("Thank you for subscribing to our newsletter!")
    })
  }

  // Apply theme colors
  applyThemeColors()
})

// Apply theme colors to elements
function applyThemeColors() {
  // Get theme colors from CSS variables
  const primaryR = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-r").trim() || "0"
  const primaryG = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-g").trim() || "123"
  const primaryB = getComputedStyle(document.documentElement).getPropertyValue("--primary-color-b").trim() || "255"

  const secondaryR = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-r").trim() || "255"
  const secondaryG = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-g").trim() || "123"
  const secondaryB = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color-b").trim() || "0"

  const bgR = getComputedStyle(document.documentElement).getPropertyValue("--background-color-r").trim() || "245"
  const bgG = getComputedStyle(document.documentElement).getPropertyValue("--background-color-g").trim() || "245"
  const bgB = getComputedStyle(document.documentElement).getPropertyValue("--background-color-b").trim() || "245"

  const bgSecondaryR =
    getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-r").trim() || "255"
  const bgSecondaryG =
    getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-g").trim() || "255"
  const bgSecondaryB =
    getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-b").trim() || "255"

  // Apply background color to body
  document.body.style.backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`

  // Apply background color to project cards
  const projectCards = document.querySelectorAll(".project-card")
  projectCards.forEach((card) => {
    card.style.backgroundColor = `rgb(${bgSecondaryR}, ${bgSecondaryG}, ${bgSecondaryB})`

    // Calculate brightness for adaptive text color
    const brightness =
      (Number.parseInt(bgSecondaryR) * 299 +
        Number.parseInt(bgSecondaryG) * 587 +
        Number.parseInt(bgSecondaryB) * 114) /
      1000
    const textColor = brightness < 128 ? "white" : "var(--gray-800)"

    // Apply text color to card elements
    const cardTitle = card.querySelector(".project-title")
    const cardDescription = card.querySelector(".project-description")
    if (cardTitle) cardTitle.style.color = textColor
    if (cardDescription) cardDescription.style.color = textColor
  })

  // Apply background color to contact form
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.style.backgroundColor = `rgb(${bgSecondaryR}, ${bgSecondaryG}, ${bgSecondaryB})`

    // Calculate brightness for adaptive text color
    const brightness =
      (Number.parseInt(bgSecondaryR) * 299 +
        Number.parseInt(bgSecondaryG) * 587 +
        Number.parseInt(bgSecondaryB) * 114) /
      1000
    const textColor = brightness < 128 ? "white" : "var(--gray-800)"

    // Apply text color to form elements
    const formTitle = contactForm.querySelector("h2")
    const formLabels = contactForm.querySelectorAll("label")
    if (formTitle) formTitle.style.color = textColor
    formLabels.forEach((label) => {
      label.style.color = textColor
    })
  }

  // Apply background color to loading screen
  const loadingScreen = document.querySelector(".loading-screen")
  if (loadingScreen) {
    loadingScreen.style.backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`
  }
}

// Fetch and render projects
async function fetchProjects() {
  const projectsContainer = document.getElementById("projects-container")

  try {
    const response = await fetch("/api/projects")

    if (!response.ok) {
      throw new Error("Failed to fetch projects")
    }

    const projects = await response.json()

    // Clear loading indicator
    projectsContainer.innerHTML = ""

    if (projects.length === 0) {
      projectsContainer.innerHTML =
        '<p class="text-center">No projects found. Add some projects through the dashboard.</p>'
      return
    }

    // Render projects
    projects.forEach((project) => {
      const projectCard = createProjectCard(project)
      projectsContainer.appendChild(projectCard)
    })

    // Apply background color to project cards
    const bgSecondaryR =
      getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-r").trim() || "255"
    const bgSecondaryG =
      getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-g").trim() || "255"
    const bgSecondaryB =
      getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-b").trim() || "255"

    const projectCards = document.querySelectorAll(".project-card")
    projectCards.forEach((card) => {
      card.style.backgroundColor = `rgb(${bgSecondaryR}, ${bgSecondaryG}, ${bgSecondaryB})`

      // Calculate brightness for adaptive text color
      const brightness =
        (Number.parseInt(bgSecondaryR) * 299 +
          Number.parseInt(bgSecondaryG) * 587 +
          Number.parseInt(bgSecondaryB) * 114) /
        1000
      const textColor = brightness < 128 ? "white" : "var(--gray-800)"

      // Apply text color to card elements
      const cardTitle = card.querySelector(".project-title")
      const cardDescription = card.querySelector(".project-description")
      if (cardTitle) cardTitle.style.color = textColor
      if (cardDescription) cardDescription.style.color = textColor
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    projectsContainer.innerHTML = '<p class="text-center">Failed to load projects. Please try again later.</p>'
  }
}

// Create project card
function createProjectCard(project) {
  const card = document.createElement("div")
  card.className = "project-card"
  card.setAttribute("data-category", project.category)

  const defaultImage =
    "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

  card.innerHTML = `
    <div class="project-image">
      <img src="${project.image || defaultImage}" alt="${project.title}">
      <div class="project-category">${getCategoryName(project.category)}</div>
    </div>
    <div class="project-content">
      <h3 class="project-title">${project.title}</h3>
      <p class="project-description">${project.description}</p>
      ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">View Project <i class="fas fa-arrow-right"></i></a>` : ""}
    </div>
  `

  return card
}

// Filter projects by category
function filterProjects(filter) {
  const projectCards = document.querySelectorAll(".project-card")

  projectCards.forEach((card) => {
    if (filter === "all" || card.getAttribute("data-category") === filter) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// Get readable category name
function getCategoryName(category) {
  const categories = {
    web: "Web Development",
    app: "App Development",
    design: "Design",
  }

  return categories[category] || category
}

// Setup contact form
function setupContactForm() {
  const contactForm = document.querySelector(".contact-form form")
  if (!contactForm) return

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const submitBtn = contactForm.querySelector("button[type='submit']")
    const nameInput = contactForm.querySelector("input[name='name']")
    const emailInput = contactForm.querySelector("input[name='email']")
    const messageInput = contactForm.querySelector("textarea[name='message']")

    // Simple validation
    if (!nameInput.value || !emailInput.value || !messageInput.value) {
      alert("Please fill out all fields")
      return
    }

    // Show loading state
    submitBtn.disabled = true
    submitBtn.innerHTML = `<span class="btn-text">Sending...</span><span class="btn-loader spinner"></span>`

    // Apply background secondary color to contact form
    const r = getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-r").trim()
    const g = getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-g").trim()
    const b = getComputedStyle(document.documentElement).getPropertyValue("--background-secondary-b").trim()

    if (r && g && b) {
      const contactFormContainer = document.querySelector(".contact-form")
      if (contactFormContainer) {
        contactFormContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`

        // Calculate brightness for adaptive text color
        const brightness = (Number.parseInt(r) * 299 + Number.parseInt(g) * 587 + Number.parseInt(b) * 114) / 1000
        const textColor = brightness < 128 ? "rgb(255, 255, 255)" : "rgb(33, 37, 41)"

        // Apply text color to form elements
        const formTitle = contactFormContainer.querySelector("h2")
        const formLabels = contactFormContainer.querySelectorAll("label")

        if (formTitle) formTitle.style.color = textColor
        formLabels.forEach((label) => {
          label.style.color = textColor
        })
      }
    }

    // Simulate form submission (replace with actual EmailJS implementation)
    setTimeout(() => {
      // Reset form
      contactForm.reset()

      // Show success message
      alert("Message sent successfully!")

      // Reset button
      submitBtn.disabled = false
      submitBtn.innerHTML = "Send Message"
    }, 2000)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  // User Name (all instances)
  const userNameElements = document.querySelectorAll(".user-name")

  // Contact Info Elements
  const emailElement = document.querySelector(".info-item:nth-child(1) p")
  const discordElement = document.querySelector(".info-item:nth-child(2) p")
  const locationElement = document.querySelector(".info-item:nth-child(3) p")

  // Get ALL social links across both sections
  const socialLinks = {
    github: document.querySelectorAll(".fa-github"),
    linkedin: document.querySelectorAll(".fa-linkedin"),
    twitter: document.querySelectorAll(".fa-twitter"),
    dribbble: document.querySelectorAll(".fa-dribbble"),
  }

  // Fetch user data
  fetch("/api/user")
    .then((response) => response.json())
    .then((userData) => {
      // Update all username instances
      userNameElements.forEach((element) => {
        element.textContent = userData.name || "Portfolio"
      })

      // Update contact info
      if (emailElement) emailElement.textContent = userData.email || "Not provided"
      if (discordElement) discordElement.textContent = userData.discord || "Not provided"
      if (locationElement) locationElement.textContent = userData.address || "Remote"

      // Update all social links
      updateSocialLinks(socialLinks.github, userData.github)
      updateSocialLinks(socialLinks.linkedin, userData.linkedin)
      updateSocialLinks(socialLinks.twitter, userData.twitter)
      updateSocialLinks(socialLinks.dribbble, userData.dribbble)
    })
    .catch((error) => {
      console.error("Error:", error)
      if (emailElement) emailElement.textContent = "Error loading data"
    })

  function updateSocialLinks(icons, url) {
    icons.forEach((icon) => {
      const link = icon.closest(".social-link")
      if (link) {
        if (url && isValidUrl(url)) {
          link.href = url
        } else {
          link.href = "#"
          link.style.opacity = "0.5" // Visual indication of disabled link
        }
      }
    })
  }

  function isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
})
