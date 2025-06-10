function updatePageTitle() {
  fetch("/api/user")
    .then((response) => response.json())
    .then((userData) => {
      const userName = userData.name?.trim() || "Dashboard"
      document.title = `${userName} - Dashboard`
    })
    .catch((error) => {
      console.error("Error updating title:", error)
      document.title = "Dashboard" // Fallback title
    })
}

// Call when page loads
document.addEventListener("DOMContentLoaded", updatePageTitle)

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const sidebar = document.querySelector(".sidebar")
  const menuToggle = document.querySelector(".menu-toggle")
  const closeSidebar = document.querySelector(".close-sidebar")
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll(".content-section")
  const topbarTitle = document.querySelector(".topbar-title")
  const projectsContainer = document.getElementById("projects-list")
  const recentProjectsContainer = document.getElementById("recent-projects")
  const totalProjectsElement = document.getElementById("total-projects")
  const projectSearch = document.getElementById("project-search")
  const categoryFilter = document.getElementById("category-filter")
  const logoutBtn = document.getElementById("logout-btn")
  const saveUserBtn = document.getElementById("save-user-btn")
  const userName = document.getElementById("user-name")
  const userEmail = document.getElementById("user-email")
  const userAddress = document.getElementById("user-address")
  const userDiscord = document.getElementById("user-discord")
  const userGithub = document.getElementById("user-github")
  const userLinkedin = document.getElementById("user-linkedin")
  const userTwitter = document.getElementById("user-twitter")

  // Add these variables to the DOM Elements section
  const backgroundPrimaryR = document.getElementById("background-primary-r")
  const backgroundPrimaryG = document.getElementById("background-primary-g")
  const backgroundPrimaryB = document.getElementById("background-primary-b")
  const backgroundSecondaryR = document.getElementById("background-secondary-r")
  const backgroundSecondaryG = document.getElementById("background-secondary-g")
  const backgroundSecondaryB = document.getElementById("background-secondary-b")
  const backgroundPrimaryColorPreview = document.getElementById("background-primary-color-preview")
  const backgroundSecondaryColorPreview = document.getElementById("background-secondary-color-preview")
  const autoTextColor = document.getElementById("auto-text-color")

  // Modals
  const projectModal = document.getElementById("project-modal")
  const confirmModal = document.getElementById("confirm-modal")
  const modalTitle = document.getElementById("modal-title")
  const projectForm = document.getElementById("project-form")
  const projectId = document.getElementById("project-id")
  const projectTitle = document.getElementById("project-title")
  const projectCategory = document.getElementById("project-category")
  const projectDescription = document.getElementById("project-description")
  const projectLink = document.getElementById("project-link")
  const projectImage = document.getElementById("project-image")
  const fileName = document.getElementById("file-name")
  const imagePreviewContainer = document.getElementById("image-preview-container")
  const imagePreview = document.getElementById("image-preview")
  const removeImageBtn = document.getElementById("remove-image")

  // Buttons
  const addProjectBtn = document.getElementById("add-project-btn")
  const newProjectBtn = document.getElementById("new-project-btn")
  const saveProjectBtn = document.getElementById("save-project-btn")
  const cancelProjectBtn = document.getElementById("cancel-project-btn")
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn")
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn")
  const closeModalBtns = document.querySelectorAll(".close-modal")
  const saveThemeBtn = document.getElementById("save-theme-btn")

  // Theme inputs
  const primaryR = document.getElementById("primary-r")
  const primaryG = document.getElementById("primary-g")
  const primaryB = document.getElementById("primary-b")
  const secondaryR = document.getElementById("secondary-r")
  const secondaryG = document.getElementById("secondary-g")
  const secondaryB = document.getElementById("secondary-b")
  const backgroundR = document.getElementById("background-r")
  const backgroundG = document.getElementById("background-g")
  const backgroundB = document.getElementById("background-b")
  const primaryColorPreview = document.getElementById("primary-color-preview")
  const secondaryColorPreview = document.getElementById("secondary-color-preview")
  const backgroundColorPreview = document.getElementById("background-color-preview")

  // Load theme settings
  loadThemeSettings()

  // Load projects
  fetchProjects()

  // Load recent projects for dashboard
  fetchRecentProjects()

  // Setup input events for color previews
  setupColorPreviews()

  // Mobile sidebar toggle
  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("show")
  })

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("show")
  })

  // Navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"))

      // Add active class to clicked link
      link.classList.add("active")

      // Hide all sections
      sections.forEach((section) => section.classList.remove("active"))

      // Show selected section
      const targetSection = link.getAttribute("data-section")
      document.getElementById(`${targetSection}-section`).classList.add("active")

      // Update topbar title
      topbarTitle.textContent = link.textContent.trim()

      // Close sidebar on mobile
      sidebar.classList.remove("show")
    })
  })

  async function loadUserData() {
    try {
      const response = await fetch("/api/user")
      const userData = await response.json()

      userName.value = userData.name
      userEmail.value = userData.email
      userAddress.value = userData.address
      userDiscord.value = userData.discord
      userGithub.value = userData.github
      userLinkedin.value = userData.linkedin
      userTwitter.value = userData.twitter
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Save user data
  async function saveUserData() {
    const userData = {
      name: userName.value,
      email: userEmail.value,
      address: userAddress.value,
      discord: userDiscord.value,
      github: userGithub.value,
      linkedin: userLinkedin.value,
      twitter: userTwitter.value,
    }

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) throw new Error("Failed to save")
      alert("User info saved successfully!")
    } catch (error) {
      console.error("Error saving user data:", error)
      alert("Error saving user info")
    }
  }

  // Initialize user form
  loadUserData()
  saveUserBtn.addEventListener("click", saveUserData)

  // Handle sections from other buttons
  document.querySelectorAll("[data-section]").forEach((button) => {
    if (!button.classList.contains("nav-link")) {
      button.addEventListener("click", (e) => {
        e.preventDefault()

        // Get the target section
        const targetSection = button.getAttribute("data-section")

        // Find the corresponding nav link and click it
        document.querySelector(`.nav-link[data-section="${targetSection}"]`).click()
      })
    }
  })

  // Project search
  projectSearch.addEventListener("input", filterProjectsList)

  // Category filter
  categoryFilter.addEventListener("change", filterProjectsList)

  // Add project buttons
  addProjectBtn.addEventListener("click", openAddProjectModal)
  newProjectBtn.addEventListener("click", openAddProjectModal)

  // Save project
  saveProjectBtn.addEventListener("click", saveProject)

  // Cancel project
  cancelProjectBtn.addEventListener("click", closeProjectModal)

  // Close modals
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      closeModal(modal)
    })
  })

  // Project image upload preview
  projectImage.addEventListener("change", handleImageUpload)

  // Remove image button
  removeImageBtn.addEventListener("click", removeProjectImage)

  // Save theme button
  saveThemeBtn.addEventListener("click", saveThemeSettings)

  // Logout button
  logoutBtn.addEventListener("click", handleLogout)

  // Functions

  // Fetch all projects
  async function fetchProjects() {
    try {
      const response = await fetch("/api/projects")

      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }

      const projects = await response.json()

      // Update total projects count
      if (totalProjectsElement) {
        totalProjectsElement.textContent = projects.length
      }

      // Clear loading indicator
      projectsContainer.innerHTML = ""

      if (projects.length === 0) {
        projectsContainer.innerHTML = '<div class="text-center"><p>No projects found. Add your first project!</p></div>'
        return
      }

      // Sort projects by creation date (newest first)
      projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      // Render projects
      projects.forEach((project) => {
        const projectCard = createProjectCard(project)
        projectsContainer.appendChild(projectCard)
      })
    } catch (error) {
      console.error("Error fetching projects:", error)
      projectsContainer.innerHTML =
        '<div class="text-center"><p>Failed to load projects. Please try again later.</p></div>'
    }
  }

  // Fetch recent projects for dashboard
  async function fetchRecentProjects() {
    try {
      const response = await fetch("/api/projects")

      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }

      const projects = await response.json()

      // Clear loading indicator
      recentProjectsContainer.innerHTML = ""

      if (projects.length === 0) {
        recentProjectsContainer.innerHTML = '<p class="text-center">No projects found. Add your first project!</p>'
        return
      }

      // Sort projects by creation date (newest first)
      projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      // Get the 3 most recent projects
      const recentProjects = projects.slice(0, 3)

      // Render recent projects
      recentProjects.forEach((project) => {
        const recentCard = createRecentProjectCard(project)
        recentProjectsContainer.appendChild(recentCard)
      })
    } catch (error) {
      console.error("Error fetching recent projects:", error)
      recentProjectsContainer.innerHTML = '<p class="text-center">Failed to load projects.</p>'
    }
  }

  // Create project card element
  function createProjectCard(project) {
    const card = document.createElement("div")
    card.className = "project-card"
    card.setAttribute("data-id", project.id)
    card.setAttribute("data-category", project.category)
    card.setAttribute("data-title", project.title)

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
        <div class="project-actions">
          <button class="action-btn edit" data-id="${project.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" data-id="${project.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `

    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector(".edit")
    const deleteBtn = card.querySelector(".delete")

    editBtn.addEventListener("click", () => {
      openEditProjectModal(project)
    })

    deleteBtn.addEventListener("click", () => {
      openDeleteConfirmation(project.id)
    })

    return card
  }

  // Create recent project card
  function createRecentProjectCard(project) {
    const card = document.createElement("div")
    card.className = "recent-project-card"

    const defaultImage =
      "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

    card.innerHTML = `
      <div class="recent-project-image">
        <img src="${project.image || defaultImage}" alt="${project.title}">
      </div>
      <div class="recent-project-content">
        <h3>${project.title}</h3>
        <span class="recent-project-category">${getCategoryName(project.category)}</span>
      </div>
    `

    // Add click event to open edit modal
    card.addEventListener("click", () => {
      openEditProjectModal(project)
      // Navigate to projects section
      document.querySelector('.nav-link[data-section="projects"]').click()
    })

    return card
  }

  // Filter projects list
  function filterProjectsList() {
    const searchTerm = projectSearch.value.toLowerCase()
    const category = categoryFilter.value
    const projectCards = document.querySelectorAll(".project-card")

    projectCards.forEach((card) => {
      const title = card.getAttribute("data-title").toLowerCase()
      const projectCategory = card.getAttribute("data-category")

      // Check if project matches both search term and category filter
      const matchesSearch = title.includes(searchTerm)
      const matchesCategory = category === "all" || projectCategory === category

      if (matchesSearch && matchesCategory) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  }

  // Open add project modal
  function openAddProjectModal() {
    modalTitle.textContent = "Add New Project"
    projectId.value = ""
    projectForm.reset()
    imagePreviewContainer.style.display = "none"
    imagePreview.src = ""
    fileName.textContent = "No file chosen"

    openModal(projectModal)
  }

  // Open edit project modal
  function openEditProjectModal(project) {
    modalTitle.textContent = "Edit Project"
    projectId.value = project.id
    projectTitle.value = project.title
    projectCategory.value = project.category
    projectDescription.value = project.description
    projectLink.value = project.link || ""
    fileName.textContent = project.image ? "Current image" : "No file chosen"

    if (project.image) {
      imagePreview.src = project.image
      imagePreviewContainer.classList.add("show")
    } else {
      imagePreviewContainer.classList.remove("show")
    }

    openModal(projectModal)
  }

  // Handle image upload
  function handleImageUpload(e) {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    // Update file name display
    fileName.textContent = file.name

    // Show image preview
    const reader = new FileReader()

    reader.onload = (e) => {
      imagePreview.src = e.target.result
      imagePreviewContainer.classList.add("show")
    }

    reader.readAsDataURL(file)
  }

  // Remove project image
  function removeProjectImage() {
    projectImage.value = ""
    imagePreview.src = ""
    imagePreviewContainer.classList.remove("show")
    fileName.textContent = "No file chosen"
  }

  // Save project
  async function saveProject() {
    const id = projectId.value
    const title = projectTitle.value
    const category = projectCategory.value
    const description = projectDescription.value
    const link = projectLink.value

    if (!title || !category || !description) {
      alert("Please fill out all required fields.")
      return
    }

    // Show loading state
    saveProjectBtn.classList.add("loading")
    saveProjectBtn.disabled = true

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("category", category)
      formData.append("description", description)
      formData.append("link", link)

      // Add image if selected
      if (projectImage.files[0]) {
        formData.append("image", projectImage.files[0])
      }

      let response

      if (id) {
        // Update existing project
        response = await fetch(`/api/projects/${id}`, {
          method: "PUT",
          body: formData,
        })
      } else {
        // Create new project
        response = await fetch("/api/projects", {
          method: "POST",
          body: formData,
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save project")
      }

      // Refresh projects list
      fetchProjects()
      fetchRecentProjects()

      // Close modal
      closeProjectModal()

      // Show success message
      alert(id ? "Project updated successfully!" : "Project created successfully!")
    } catch (error) {
      console.error("Error saving project:", error)
      alert("An error occurred. Please try again.")
    } finally {
      // Remove loading state
      saveProjectBtn.classList.remove("loading")
      saveProjectBtn.disabled = false
    }
  }

  // Open delete confirmation modal
  function openDeleteConfirmation(id) {
    // Set project ID for delete operation
    confirmDeleteBtn.setAttribute("data-id", id)

    // Open confirmation modal
    openModal(confirmModal)
  }

  // Delete project
  confirmDeleteBtn.addEventListener("click", async function () {
    const id = this.getAttribute("data-id")

    // Show loading state
    confirmDeleteBtn.classList.add("loading")
    confirmDeleteBtn.disabled = true

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      // Refresh projects list
      fetchProjects()
      fetchRecentProjects()

      // Close modal
      closeModal(confirmModal)

      // Show success message
      alert("Project deleted successfully!")
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("An error occurred. Please try again.")
    } finally {
      // Remove loading state
      confirmDeleteBtn.classList.remove("loading")
      confirmDeleteBtn.disabled = false
    }
  })

  // Cancel delete
  cancelDeleteBtn.addEventListener("click", () => {
    closeModal(confirmModal)
  })

  // Load theme settings
  async function loadThemeSettings() {
    try {
      const response = await fetch("/api/theme")

      if (!response.ok) {
        throw new Error("Failed to load theme settings")
      }

      const theme = await response.json()

      // Set primary color inputs
      if (theme.primaryColor) {
        const [r, g, b] = theme.primaryColor.split(",").map((val) => Number.parseInt(val.trim()))
        primaryR.value = r
        primaryG.value = g
        primaryB.value = b
        primaryColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
      }

      // Set secondary color inputs
      if (theme.secondaryColor) {
        const [r, g, b] = theme.secondaryColor.split(",").map((val) => Number.parseInt(val.trim()))
        secondaryR.value = r
        secondaryG.value = g
        secondaryB.value = b
        secondaryColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
      }

      // Set main background color inputs
      if (theme.backgroundColor) {
        const [r, g, b] = theme.backgroundColor.split(",").map((val) => Number.parseInt(val.trim()))
        backgroundR.value = r
        backgroundG.value = g
        backgroundB.value = b
        backgroundColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
      } else {
        // Default background color (white)
        backgroundR.value = 255
        backgroundG.value = 255
        backgroundB.value = 255
        backgroundColorPreview.style.backgroundColor = "rgb(255, 255, 255)"
      }

      // Set primary background color inputs
      if (theme.backgroundColorPrimary) {
        const [r, g, b] = theme.backgroundColorPrimary.split(",").map((val) => Number.parseInt(val.trim()))
        backgroundPrimaryR.value = r
        backgroundPrimaryG.value = g
        backgroundPrimaryB.value = b
        backgroundPrimaryColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
      } else {
        // Default primary background color (light gray)
        backgroundPrimaryR.value = 245
        backgroundPrimaryG.value = 245
        backgroundPrimaryB.value = 245
        backgroundPrimaryColorPreview.style.backgroundColor = "rgb(245, 245, 245)"
      }

      // Set secondary background color inputs
      if (theme.backgroundColorSecondary) {
        const [r, g, b] = theme.backgroundColorSecondary.split(",").map((val) => Number.parseInt(val.trim()))
        backgroundSecondaryR.value = r
        backgroundSecondaryG.value = g
        backgroundSecondaryB.value = b
        backgroundSecondaryColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
      } else {
        // Default secondary background color (lighter gray)
        backgroundSecondaryR.value = 235
        backgroundSecondaryG.value = 235
        backgroundSecondaryB.value = 235
        backgroundSecondaryColorPreview.style.backgroundColor = "rgb(235, 235, 235)"
      }

      // Update preview
      updateThemePreview()
    } catch (error) {
      console.error("Error loading theme settings:", error)
    }
  }

  // Setup color previews
  function setupColorPreviews() {
    // Primary color preview
    ;[primaryR, primaryG, primaryB].forEach((input) => {
      input.addEventListener("input", () => {
        const r = primaryR.value || 0
        const g = primaryG.value || 0
        const b = primaryB.value || 0
        primaryColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
        updateThemePreview()
      })
    })

    // Secondary color preview
    ;[secondaryR, secondaryG, secondaryB].forEach((input) => {
      input.addEventListener("input", () => {
        const r = secondaryR.value || 0
        const g = secondaryG.value || 0
        const b = secondaryB.value || 0
        secondaryColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
        updateThemePreview()
      })
    })

    // Background color preview
    ;[backgroundR, backgroundG, backgroundB].forEach((input) => {
      input.addEventListener("input", () => {
        const r = backgroundR.value || 0
        const g = backgroundG.value || 0
        const b = backgroundB.value || 0
        backgroundColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
        updateThemePreview()
      })
    })

    // Background primary color preview
    if (backgroundPrimaryR) {
      backgroundPrimaryR.addEventListener("input", updateBackgroundPrimaryColor)
    }
    if (backgroundPrimaryG) {
      backgroundPrimaryG.addEventListener("input", updateBackgroundPrimaryColor)
    }
    if (backgroundPrimaryB) {
      backgroundPrimaryB.addEventListener("input", updateBackgroundPrimaryColor)
    }
    // Background secondary color preview
    ;[backgroundSecondaryR, backgroundSecondaryG, backgroundSecondaryB].forEach((input) => {
      if (input) {
        input.addEventListener("input", () => {
          const r = backgroundSecondaryR.value || 0
          const g = backgroundSecondaryG.value || 0
          const b = backgroundSecondaryB.value || 0
          backgroundSecondaryColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
          updateThemePreview()
        })
      }
    })

    // Auto text color toggle
    if (autoTextColor) {
      autoTextColor.addEventListener("change", updateThemePreview)
    }
  }

  // Add this function after the setupColorPreviews function:
  function updateBackgroundPrimaryColor() {
    const r = backgroundPrimaryR.value || 0
    const g = backgroundPrimaryG.value || 0
    const b = backgroundPrimaryB.value || 0
    backgroundPrimaryColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    updateThemePreview()
  }

  // Update theme preview
  function updateThemePreview() {
    const previewLogo = document.querySelector(".preview-logo")
    const previewHeading = document.querySelector(".preview-heading")
    const previewButtonPrimary = document.querySelector(".preview-button-primary")
    const previewNavActive = document.querySelector(".preview-nav-item.active")
    const previewButtonSecondary = document.querySelector(".preview-button-secondary")
    const previewButton = document.querySelector(".preview-button")
    const previewContainer = document.querySelector(".preview-container")
    const previewCards = document.querySelectorAll(".preview-card")
    const previewText = document.querySelector(".preview-text")

    if (!previewLogo) return // Exit if preview elements don't exist

    const primaryColor = `rgb(${primaryR.value || 0}, ${primaryG.value || 0}, ${primaryB.value || 0})`
    const secondaryColor = `rgb(${secondaryR.value || 0}, ${secondaryG.value || 0}, ${secondaryB.value || 0})`
    const backgroundColor = `rgb(${backgroundR.value || 255}, ${backgroundG.value || 255}, ${backgroundB.value || 255})`
    const backgroundPrimaryColor = `rgb(${backgroundPrimaryR.value || 245}, ${backgroundPrimaryG.value || 245}, ${backgroundPrimaryB.value || 245})`
    const backgroundSecondaryColor = `rgb(${backgroundSecondaryR.value || 235}, ${backgroundSecondaryG.value || 235}, ${backgroundSecondaryB.value || 235})`

    previewLogo.style.color = primaryColor
    previewHeading.style.backgroundColor = primaryColor
    previewButtonPrimary.style.backgroundColor = primaryColor

    previewNavActive.style.backgroundColor = secondaryColor
    previewButtonSecondary.style.backgroundColor = secondaryColor
    previewButton.style.backgroundColor = secondaryColor

    previewContainer.style.backgroundColor = backgroundColor

    // Apply background colors to cards
    previewCards.forEach((card, index) => {
      if (index % 2 === 0) {
        card.style.backgroundColor = backgroundPrimaryColor
      } else {
        card.style.backgroundColor = backgroundSecondaryColor
      }
    })

    // Auto-adjust text color based on background brightness if enabled
    if (autoTextColor && autoTextColor.checked) {
      // Calculate brightness of background color (simple formula: (R*299 + G*587 + B*114) / 1000)
      const r = Number.parseInt(backgroundR.value || 255)
      const g = Number.parseInt(backgroundG.value || 255)
      const b = Number.parseInt(backgroundB.value || 255)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000

      // If background is dark, use white text; otherwise, use dark text
      const textColor = brightness < 128 ? "white" : "var(--gray-800)"
      previewLogo.style.color = textColor
      previewText.style.backgroundColor = textColor === "white" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
    }
  }

  // Save theme settings
  async function saveThemeSettings() {
    // Validate inputs
    const validateInput = (input) => {
      const value = Number.parseInt(input.value)
      return !isNaN(value) && value >= 0 && value <= 255
    }

    const primaryInputs = [primaryR, primaryG, primaryB]
    const secondaryInputs = [secondaryR, secondaryG, secondaryB]
    const backgroundInputs = [backgroundR, backgroundG, backgroundB]
    const backgroundPrimaryInputs = [backgroundPrimaryR, backgroundPrimaryG, backgroundPrimaryB]
    const backgroundSecondaryInputs = [backgroundSecondaryR, backgroundSecondaryG, backgroundSecondaryB]

    if (
      !primaryInputs.every(validateInput) ||
      !secondaryInputs.every(validateInput) ||
      !backgroundInputs.every(validateInput) ||
      !backgroundPrimaryInputs.every(validateInput) ||
      !backgroundSecondaryInputs.every(validateInput)
    ) {
      alert("Please enter valid RGB values (0-255) for all color inputs.")
      return
    }

    // Show loading state
    saveThemeBtn.classList.add("loading")
    saveThemeBtn.disabled = true

    try {
      const primaryColor = `${primaryR.value}, ${primaryG.value}, ${primaryB.value}`
      const secondaryColor = `${secondaryR.value}, ${secondaryG.value}, ${secondaryB.value}`
      const backgroundColor = `${backgroundR.value}, ${backgroundG.value}, ${backgroundB.value}`
      const backgroundColorPrimary = `${backgroundPrimaryR.value}, ${backgroundPrimaryG.value}, ${backgroundPrimaryB.value}`
      const backgroundColorSecondary = `${backgroundSecondaryR.value}, ${backgroundSecondaryG.value}, ${backgroundSecondaryB.value}`

      // Calculate appropriate text colors based on background brightness
      const bgBrightness =
        (Number.parseInt(backgroundR.value) * 299 +
          Number.parseInt(backgroundG.value) * 587 +
          Number.parseInt(backgroundB.value) * 114) /
        1000
      const textColorLight = "255, 255, 255" // White
      const textColorDark = "33, 37, 41" // Dark gray

      const response = await fetch("/api/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryColor,
          secondaryColor,
          backgroundColor,
          backgroundColorPrimary,
          backgroundColorSecondary,
          textColorLight,
          textColorDark,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save theme settings")
      }

      // Show success message
      alert("Theme settings saved successfully!")

      // Apply theme to the entire site
      document.documentElement.style.setProperty("--primary-color-r", primaryR.value)
      document.documentElement.style.setProperty("--primary-color-g", primaryG.value)
      document.documentElement.style.setProperty("--primary-color-b", primaryB.value)

      document.documentElement.style.setProperty("--secondary-color-r", secondaryR.value)
      document.documentElement.style.setProperty("--secondary-color-g", secondaryG.value)
      document.documentElement.style.setProperty("--secondary-color-b", secondaryB.value)

      document.documentElement.style.setProperty("--background-color-r", backgroundR.value)
      document.documentElement.style.setProperty("--background-color-g", backgroundG.value)
      document.documentElement.style.setProperty("--background-color-b", backgroundB.value)

      document.documentElement.style.setProperty("--background-primary-r", backgroundPrimaryR.value)
      document.documentElement.style.setProperty("--background-primary-g", backgroundPrimaryG.value)
      document.documentElement.style.setProperty("--background-primary-b", backgroundPrimaryB.value)

      document.documentElement.style.setProperty("--background-secondary-r", backgroundSecondaryR.value)
      document.documentElement.style.setProperty("--background-secondary-g", backgroundSecondaryG.value)
      document.documentElement.style.setProperty("--background-secondary-b", backgroundSecondaryB.value)

      // Apply text color based on background brightness
      if (autoTextColor && autoTextColor.checked) {
        const textColor = bgBrightness < 128 ? textColorLight : textColorDark
        document.documentElement.style.setProperty("--text-color", textColor)
      }

      // Apply background color directly to body
      document.body.style.backgroundColor = `rgb(${backgroundR.value}, ${backgroundG.value}, ${backgroundB.value})`
    } catch (error) {
      console.error("Error saving theme settings:", error)
      alert("An error occurred. Please try again.")
    } finally {
      // Remove loading state
      saveThemeBtn.classList.remove("loading")
      saveThemeBtn.disabled = false
    }
  }

  // Handle logout
  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      })

      if (response.ok) {
        // Redirect to login page
        window.location.href = "/login"
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      alert("An error occurred during logout. Please try again.")
    }
  }

  // Close project modal
  function closeProjectModal() {
    closeModal(projectModal)
  }

  // Open modal
  function openModal(modal) {
    modal.classList.add("show")
  }

  // Close modal
  function closeModal(modal) {
    modal.classList.remove("show")
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

  // Update the color picker functionality to include the new color pickers
  const colorPickers = document.querySelectorAll(".color-preview")
  let activeColorPicker = null
  let activeColorType = null

  // Define predefined colors
  const predefinedColors = [
    "255, 0, 0", // Red
    "0, 255, 0", // Green
    "0, 0, 255", // Blue
    "255, 255, 0", // Yellow
    "255, 0, 255", // Magenta
    "0, 255, 255", // Cyan
    "255, 255, 255", // White
    "0, 0, 0", // Black
    "128, 128, 128", // Gray
    "192, 192, 192", // Silver
    "128, 0, 0", // Maroon
    "128, 128, 0", // Olive
    "0, 128, 0", // Green (Dark)
    "128, 0, 128", // Purple
    "0, 128, 128", // Teal
    "0, 0, 128", // Navy
  ]

  // Create color picker popup element
  const colorPickerPopup = document.createElement("div")
  colorPickerPopup.className = "color-picker-popup"
  document.body.appendChild(colorPickerPopup)

  // Update the color picker popup content generation
  function generateColorPicker() {
    return `
    <div class="color-grid">
      ${predefinedColors
        .map(
          (color) => `
        <div class="color-swatch" style="background-color: rgb(${color})" data-color="${color}"></div>
      `,
        )
        .join("")}
    </div>
    <div class="custom-color">
      <div class="color-preview-large" id="popup-color-preview"></div>
      <div class="color-inputs">
        <input type="number" min="0" max="255" placeholder="R" class="custom-r">
        <input type="number" min="0" max="255" placeholder="G" class="custom-g">
        <input type="number" min="0" max="255" placeholder="B" class="custom-b">
      </div>
      <button class="btn btn-sm btn-primary apply-color">Apply</button>
    </div>
  `
  }

  // Update the updateColor function to handle the new color pickers
  function updateColor(color) {
    const [r, g, b] = color.split(",").map((c) => c.trim())

    if (activeColorType === "primary") {
      primaryR.value = r
      primaryG.value = g
      primaryB.value = b
      primaryColorPreview.style.backgroundColor = `rgb(${color})`
    } else if (activeColorType === "secondary") {
      secondaryR.value = r
      secondaryG.value = g
      secondaryB.value = b
      secondaryColorPreview.style.backgroundColor = `rgb(${color})`
    } else if (activeColorType === "background") {
      backgroundR.value = r
      backgroundG.value = g
      backgroundB.value = b
      backgroundColorPreview.style.backgroundColor = `rgb(${color})`
    } else if (activeColorType === "background-primary") {
      backgroundPrimaryR.value = r
      backgroundPrimaryG.value = g
      backgroundPrimaryB.value = b
      backgroundPrimaryColorPreview.style.backgroundColor = `rgb(${color})`
    } else if (activeColorType === "background-secondary") {
      backgroundSecondaryR.value = r
      backgroundSecondaryG.value = g
      backgroundSecondaryB.value = b
      backgroundSecondaryColorPreview.style.backgroundColor = `rgb(${color})`
    }

    updateThemePreview()
  }

  // Update the color picker click event to handle the new color pickers
  colorPickers.forEach((picker) => {
    picker.addEventListener("click", function (e) {
      e.stopPropagation()
      const rect = this.getBoundingClientRect()
      activeColorPicker = this

      // Correctly identify which color picker was clicked
      if (this.id === "primary-color-preview") {
        activeColorType = "primary"
      } else if (this.id === "secondary-color-preview") {
        activeColorType = "secondary"
      } else if (this.id === "background-color-preview") {
        activeColorType = "background"
      } else if (this.id === "background-primary-color-preview") {
        activeColorType = "background-primary"
      } else if (this.id === "background-secondary-color-preview") {
        activeColorType = "background-secondary"
      }

      colorPickerPopup.innerHTML = generateColorPicker()
      colorPickerPopup.style.top = `${rect.bottom + 10}px`
      colorPickerPopup.style.left = `${rect.left}px`
      colorPickerPopup.classList.add("show")

      // Set current color in custom inputs
      const currentColor = getComputedStyle(this).backgroundColor
      const [r, g, b] = currentColor.match(/\d+/g)
      colorPickerPopup.querySelector(".custom-r").value = r
      colorPickerPopup.querySelector(".custom-g").value = g
      colorPickerPopup.querySelector(".custom-b").value = b
      colorPickerPopup.querySelector("#popup-color-preview").style.backgroundColor = currentColor

      // Add event listeners to color swatches
      colorPickerPopup.querySelectorAll(".color-swatch").forEach((swatch) => {
        swatch.addEventListener("click", function () {
          const color = this.dataset.color
          updateColor(color)
          colorPickerPopup.classList.remove("show")
        })
      })

      // Add event listeners to custom color inputs
      const customInputs = colorPickerPopup.querySelectorAll('input[type="number"]')
      customInputs.forEach((input) => {
        input.addEventListener("input", () => {
          const r = colorPickerPopup.querySelector(".custom-r").value || 0
          const g = colorPickerPopup.querySelector(".custom-g").value || 0
          const b = colorPickerPopup.querySelector(".custom-b").value || 0
          colorPickerPopup.querySelector("#popup-color-preview").style.backgroundColor = `rgb(${r}, ${g}, ${b})`
        })
      })

      // Add event listener to apply button
      const applyBtn = colorPickerPopup.querySelector(".apply-color")
      applyBtn.addEventListener("click", () => {
        const r = colorPickerPopup.querySelector(".custom-r").value || 0
        const g = colorPickerPopup.querySelector(".custom-g").value || 0
        const b = colorPickerPopup.querySelector(".custom-b").value || 0
        updateColor(`${r}, ${g}, ${b}`)
        colorPickerPopup.classList.remove("show")
      })
    })
  })

  // Close color picker when clicking outside
  document.addEventListener("click", (e) => {
    if (!colorPickerPopup.contains(e.target) && !e.target.classList.contains("color-preview")) {
      colorPickerPopup.classList.remove("show")
    }
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const userNameElements = document.querySelectorAll(".user-name")

  // Fetch user data
  fetch("/api/user")
    .then((response) => response.json())
    .then((userData) => {
      // Update all username instances
      userNameElements.forEach((element) => {
        element.textContent = userData.name || "Portfolio"
      })
    })
    .catch((error) => {
      console.error("Error loading user data:", error)
      // Optional: Show error in username elements
      userNameElements.forEach((element) => {
        element.textContent = "Error loading name"
      })
    })
})

function loadLoaderSettings() {}
function saveLoaderSettings() {}
