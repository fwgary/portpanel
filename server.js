import express from "express"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import fs from "fs"
import multer from "multer"

// Configuration
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("public"))

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({ storage: storage })

// Data storage paths
const projectsPath = path.join(__dirname, "data", "projects.json")
const themePath = path.join(__dirname, "data", "theme.json")
const userPath = path.join(__dirname, "data", "user.json")
const loaderPath = path.join(__dirname, "data", "loader.json")

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"))
}

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, "public", "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "public", "uploads"), { recursive: true })
}

// Initialize projects data if not exists
if (!fs.existsSync(projectsPath)) {
  fs.writeFileSync(projectsPath, JSON.stringify([]))
}

// Initialize theme data if not exists
if (!fs.existsSync(themePath)) {
  fs.writeFileSync(
    themePath,
    JSON.stringify({
      primaryColor: "33, 37, 41",
      secondaryColor: "13, 110, 253",
    }),
  )
}

// Initialize loader data if not exists
if (!fs.existsSync(loaderPath)) {
  fs.writeFileSync(
    loaderPath,
    JSON.stringify({
      type: "spinner",
      size: "50",
      speed: "1",
      colorType: "primary",
      customColor: "0, 0, 0",
      text: "Loading...",
      showText: true,
      buttonType: "spinner",
    }),
  )
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) return res.redirect("/login")

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login")
    req.user = user
    next()
  })
}

// Routes
// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

// API for projects
app.get("/api/projects", (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"))
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: "Error reading projects" })
  }
})

// Initialize user data if not exists
if (!fs.existsSync(userPath)) {
  fs.writeFileSync(
    userPath,
    JSON.stringify(
      {
        name: "",
        email: "",
        address: "Remote",
        discord: "",
        github: "",
        linkedin: "",
        twitter: "",
      },
      null,
      2,
    ),
  )
}

app.put("/api/user", authenticateToken, (req, res) => {
  try {
    const { name, email, address, discord, github, linkedin, twitter } = req.body
    const userData = {
      name,
      email,
      address: address || "Remote", // Default value
      discord,
      github,
      linkedin,
      twitter,
    }

    fs.writeFileSync(userPath, JSON.stringify(userData, null, 2))
    res.json(userData)
  } catch (error) {
    res.status(500).json({ message: "Error updating user info" })
  }
})

// Update GET endpoint to handle empty values
app.get("/api/user", (req, res) => {
  try {
    const rawData = fs.readFileSync(userPath, "utf8")
    const userData = JSON.parse(rawData)

    // Ensure all fields exist with empty defaults
    const safeData = {
      name: userData.name || "",
      email: userData.email || "",
      address: userData.address || "Remote",
      discord: userData.discord || "",
      github: userData.github || "",
      linkedin: userData.linkedin || "",
      twitter: userData.twitter || "",
    }

    res.json(safeData)
  } catch (error) {
    res.status(500).json({ message: "Error reading user info" })
  }
})

app.post("/api/projects", authenticateToken, upload.single("image"), (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"))
    const newProject = {
      id: Date.now().toString(),
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      link: req.body.link,
      createdAt: new Date().toISOString(),
    }

    projects.push(newProject)
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2))
    res.status(201).json(newProject)
  } catch (error) {
    res.status(500).json({ message: "Error creating project" })
  }
})

app.put("/api/projects/:id", authenticateToken, upload.single("image"), (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"))
    const index = projects.findIndex((p) => p.id === req.params.id)

    if (index === -1) return res.status(404).json({ message: "Project not found" })

    const updatedProject = {
      ...projects[index],
      title: req.body.title || projects[index].title,
      description: req.body.description || projects[index].description,
      category: req.body.category || projects[index].category,
      link: req.body.link || projects[index].link,
    }

    if (req.file) {
      // If old image exists, delete it
      if (projects[index].image && projects[index].image.startsWith("/uploads/")) {
        const oldImagePath = path.join(__dirname, "public", projects[index].image)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      updatedProject.image = `/uploads/${req.file.filename}`
    }

    projects[index] = updatedProject
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2))
    res.json(updatedProject)
  } catch (error) {
    res.status(500).json({ message: "Error updating project" })
  }
})

app.delete("/api/projects/:id", authenticateToken, (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"))
    const index = projects.findIndex((p) => p.id === req.params.id)

    if (index === -1) return res.status(404).json({ message: "Project not found" })

    // Delete associated image if exists
    if (projects[index].image && projects[index].image.startsWith("/uploads/")) {
      const imagePath = path.join(__dirname, "public", projects[index].image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    projects.splice(index, 1)
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2))
    res.json({ message: "Project deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting project" })
  }
})

// API for theme
app.get("/api/theme", (req, res) => {
  try {
    const theme = JSON.parse(fs.readFileSync(themePath, "utf8"))
    res.json(theme)
  } catch (error) {
    res.status(500).json({ message: "Error reading theme" })
  }
})

// In the PUT /api/theme endpoint, update the theme object to include the new properties
app.put("/api/theme", authenticateToken, (req, res) => {
  try {
    const {
      primaryColor,
      secondaryColor,
      backgroundColor,
      backgroundColorPrimary,
      backgroundColorSecondary,
      textColorLight,
      textColorDark,
    } = req.body

    const theme = {
      primaryColor,
      secondaryColor,
      backgroundColor,
      backgroundColorPrimary,
      backgroundColorSecondary,
      textColorLight,
      textColorDark,
    }

    fs.writeFileSync(themePath, JSON.stringify(theme, null, 2))
    res.json(theme)
  } catch (error) {
    res.status(500).json({ message: "Error updating theme" })
  }
})

// API for loader
app.get("/api/loader", (req, res) => {
  try {
    const loader = JSON.parse(fs.readFileSync(loaderPath, "utf8"))
    res.json(loader)
  } catch (error) {
    res.status(500).json({ message: "Error reading loader settings" })
  }
})

app.put("/api/loader", authenticateToken, (req, res) => {
  try {
    const { type, size, speed, colorType, customColor, text, showText, buttonType } = req.body

    const loader = {
      type,
      size,
      speed,
      colorType,
      customColor,
      text,
      showText,
      buttonType,
    }

    fs.writeFileSync(loaderPath, JSON.stringify(loader, null, 2))
    res.json(loader)
  } catch (error) {
    res.status(500).json({ message: "Error updating loader settings" })
  }
})

// Auth routes
app.post("/api/login", (req, res) => {
  const { username, password } = req.body

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const user = { username }
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    })
    res.json({ message: "Login successful" })
  } else {
    res.status(401).json({ message: "Invalid credentials" })
  }
})

app.post("/api/logout", (req, res) => {
  res.clearCookie("jwt")
  res.json({ message: "Logout successful" })
})

// Route handler for dashboard (secured)
app.get("/dashboard", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
})

// Fallback route for SPA
app.get("*", (req, res) => {
  // Don't serve index.html for API routes and explicit routes
  if (req.path.startsWith("/api/") || req.path === "/login" || req.path === "/dashboard") {
    return res.status(404).json({ message: "Not found" })
  }
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
