// Module Navigation
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userRole = sessionStorage.getItem("userRole")
  const currentPage = window.location.pathname

  // Redirect to login if not authenticated (except on login page)
  if (!userRole && !currentPage.includes("login.html")) {
    window.location.href = "login.html"
    return
  }

  // Verify correct page for role
  if (userRole === "director" && currentPage.includes("agente.html")) {
    window.location.href = "director.html"
  } else if (userRole === "agente" && currentPage.includes("director.html")) {
    window.location.href = "agente.html"
  }

  // Handle navigation links
  const navLinks = document.querySelectorAll(".nav-link")
  const modules = document.querySelectorAll(".module")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      // Hide all modules
      modules.forEach((m) => m.classList.remove("active"))

      // Show selected module
      const moduleId = "module-" + this.dataset.module
      const targetModule = document.getElementById(moduleId)
      if (targetModule) {
        targetModule.classList.add("active")
      }

      // Close mobile menu if open
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove("active")
      }
    })
  })

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const sidebar = document.getElementById("sidebar")

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove("active")
      }
    }
  })

  // Toast notification system
  const showToast = (message, type = "info") => {
    const toastContainer = document.getElementById("toastContainer")
    if (!toastContainer) return

    const toast = document.createElement("div")
    toast.className = "toast"

    const icon = type === "success" ? "✅" : type === "warning" ? "⚠️" : "ℹ️"
    toast.innerHTML = `<strong>${icon} ${message}</strong>`

    toastContainer.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  // Make showToast available globally
  window.showToast = showToast

  // Simulate data updates
  setInterval(() => {
    const integrity = document.querySelector(".stat-value")
    if (integrity && integrity.textContent.includes("%")) {
      const currentValue = Number.parseFloat(integrity.textContent)
      const newValue = (currentValue + (Math.random() - 0.5) * 0.1).toFixed(1)
      if (newValue >= 95 && newValue <= 100) {
        integrity.textContent = newValue + "%"
      }
    }
  }, 5000)

  // Add click handlers for action buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-small")) {
      const buttonText = e.target.textContent.trim()

      if (buttonText === "Resolver") {
        showToast("Resolviendo duplicado...", "info")
      } else if (buttonText === "Agregar a Pipeline") {
        showToast("Prospecto agregado al pipeline", "success")
      } else if (buttonText === "Sincronizar Ahora") {
        showToast("Sincronizando datos...", "info")
        setTimeout(() => {
          showToast("Sincronización completada", "success")
        }, 2000)
      } else if (buttonText === "Llamar") {
        showToast("Iniciando llamada...", "info")
      } else if (buttonText === "Enviar Email") {
        showToast("Abriendo cliente de correo...", "info")
      } else if (buttonText === "Agendar") {
        showToast("Abriendo calendario...", "info")
      }
    }
  })

  // Animate charts on load
  setTimeout(() => {
    const barFills = document.querySelectorAll(".bar-fill")
    barFills.forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0%"
      setTimeout(() => {
        bar.style.width = width
      }, 100)
    })
  }, 300)

  // Add hover effects to prospect cards
  const prospectCards = document.querySelectorAll(".prospect-card")
  prospectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.borderColor = "var(--primary)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.borderColor = "var(--border)"
    })
  })

  // Initialize Luckysheet when the page loads
  let luckysheetInitialized = false

  const areaTrabajoLink = document.querySelector('[data-module="area-trabajo"]')
  if (areaTrabajoLink) {
    areaTrabajoLink.addEventListener("click", () => {
      setTimeout(() => {
        if (!luckysheetInitialized && document.getElementById("luckysheet")) {
          initializeLuckysheet()
          luckysheetInitialized = true
        }
      }, 100)
    })
  }

  function initializeLuckysheet() {
    const luckysheet = window.luckysheet

    if (typeof luckysheet === "undefined") {
      console.log("[v0] Luckysheet library not loaded yet, retrying...")
      setTimeout(initializeLuckysheet, 300)
      return
    }

    const options = {
      container: "luckysheet",
      lang: "es",
      title: "Área de Trabajo CRM",
      showinfobar: false,
      showtoolbar: true,
      sheetFormulaBar: true,
      showsheetbar: true,
      showstatisticBar: true,
      allowEdit: true,
      data: [
        {
          name: "Hoja1",
          status: 1,
          order: 0,
          row: 50,    // número de filas iniciales
          column: 15,  // número de columnas iniciales
          data: [],
          config: {
            columnlen: { 0: 150, 1: 150, 2: 150, 3: 150, 4: 150 }
          }
        }
      ]
    };


    try {
      luckysheet.create(options)
      console.log("[v0] Luckysheet initialized successfully")
      showToast("Hoja de cálculo lista", "success")
      setTimeout(() => { window.dispatchEvent(new Event("resize")); }, 100);
    } catch (error) {
      console.error("[v0] Error initializing Luckysheet:", error)
      showToast("Error al inicializar la hoja", "warning")
    }
  }

  window.loadTemplate = (templateType) => {
    if (!window.luckysheet) {
      showToast("Inicializando hoja de cálculo...", "info")
      return
    }

    let templateData = []

    if (templateType === "ventas") {
      templateData = [
        [
          { v: "Folio", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Cliente", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Fecha", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Monto", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Estado", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Vendedor", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
        ],
        [
          { v: "VEN-2025-001" },
          { v: "Metalúrgica Industrial" },
          { v: "2025-03-15" },
          { v: "$85,000" },
          { v: "Cerrado" },
          { v: "Juan Pérez" },
        ],
        [
          { v: "VEN-2025-002" },
          { v: "AutoPartes del Norte" },
          { v: "2025-03-14" },
          { v: "$120,000" },
          { v: "Negociación" },
          { v: "María García" },
        ],
        [
          { v: "VEN-2025-003" },
          { v: "TecnoPack Solutions" },
          { v: "2025-03-12" },
          { v: "$65,000" },
          { v: "Cotización" },
          { v: "Carlos López" },
        ],
      ]
    } else if (templateType === "prospectos") {
      templateData = [
        [
          { v: "Empresa", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Contacto", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Email", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Teléfono", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Estado", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
          { v: "Prioridad", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
        ],
        [
          { v: "Industrias del Pacífico" },
          { v: "Ing. Roberto Sánchez" },
          { v: "rsanchez@industriaspacifico.com" },
          { v: "(81) 1234-5678" },
          { v: "Contactado" },
          { v: "Alta" },
        ],
        [
          { v: "Electrónica Avanzada" },
          { v: "Lic. María González" },
          { v: "mgonzalez@electronica.com" },
          { v: "(33) 9876-5432" },
          { v: "Nuevo" },
          { v: "Media" },
        ],
        [
          { v: "Manufactura Express" },
          { v: "Ing. Carlos Ramírez" },
          { v: "cramirez@mfgexpress.com" },
          { v: "(55) 5555-1234" },
          { v: "Calificado" },
          { v: "Alta" },
        ],
      ]
    }

    // Use the correct Luckysheet API method
    try {
      window.luckysheet.setSheetData({
        data: templateData,
      })
      updateRowCount()
      showToast(`Plantilla de ${templateType} cargada`, "success")
    } catch (error) {
      console.error("Error loading template:", error)
      showToast("Error al cargar plantilla", "warning")
    }
  }

  // Export spreadsheet data
  window.exportSpreadsheet = () => {
    if (!window.luckysheet) {
      showToast("No hay datos para exportar", "warning")
      return
    }

    showToast("Preparando exportación...", "info")
    try {
      const sheetData = window.luckysheet.getAllSheets()
      console.log("Exporting sheet data:", sheetData)
      showToast("Datos exportados. Consulta la consola del navegador.", "success")
    } catch (error) {
      console.error("Export error:", error)
      showToast("Error al exportar", "warning")
    }
  }

  // Clear spreadsheet
  window.clearSpreadsheet = () => {
    if (!window.luckysheet) {
      showToast("No hay datos para limpiar", "warning")
      return
    }

    const emptyData = [
      [
        { v: "Columna 1", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
        { v: "Columna 2", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
        { v: "Columna 3", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
        { v: "Columna 4", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
        { v: "Columna 5", bg: "#3b82f6", fc: "#ffffff", bl: 1 },
      ],
      [],
      [],
      [],
    ]

    try {
      window.luckysheet.setSheetData({
        data: emptyData,
      })
      updateRowCount()
      showToast("Hoja limpiada", "success")
    } catch (error) {
      console.error("Clear error:", error)
      showToast("Error al limpiar", "warning")
    }
  }

  // Add new row
  window.addNewRow = () => {
    if (!window.luckysheet) {
      showToast("Inicializa la hoja primero", "warning")
      return
    }

    try {
      window.luckysheet.insertRow()
      updateRowCount()
      showToast("Nueva fila agregada", "success")
    } catch (error) {
      console.error("Insert row error:", error)
      showToast("Error al agregar fila", "warning")
    }
  }

  // Export to CSV
  window.exportToCSV = () => {
    if (!window.luckysheet) {
      showToast("No hay datos para exportar", "warning")
      return
    }

    try {
      const allSheets = window.luckysheet.getAllSheets()
      if (!allSheets || allSheets.length === 0) {
        showToast("No hay datos para exportar", "warning")
        return
      }

      const sheetData = allSheets[0].data
      let csvContent = ""

      sheetData.forEach((row) => {
        if (row) {
          const rowData = row.map((cell) => {
            if (cell && cell.v !== undefined && cell.v !== null) {
              return `"${cell.v}"`
            }
            return '""'
          })
          csvContent += rowData.join(",") + "\n"
        }
      })

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `crm_data_${Date.now()}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showToast("CSV exportado exitosamente", "success")
    } catch (error) {
      console.error("Export CSV error:", error)
      showToast("Error al exportar CSV", "warning")
    }
  }

  // Export to Excel
  window.exportToExcel = () => {
    if (!window.luckysheet) {
      showToast("No hay datos para exportar", "warning")
      return
    }

    showToast("Usa el menú de Luckysheet: Archivo > Exportar > Excel", "info")
  }

  // Import from file
  window.importFromFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.xls"

    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        showToast(`Importando ${file.name}...`, "info")
        setTimeout(() => {
          showToast("Función de importación en desarrollo", "info")
        }, 1000)
      }
    }

    input.click()
  }

  // Update row count
  function updateRowCount() {
    const totalRowsEl = document.getElementById("totalRows")
    if (totalRowsEl && window.luckysheet) {
      try {
        const allSheets = window.luckysheet.getAllSheets()
        if (allSheets && allSheets.length > 0) {
          const sheetData = allSheets[0].data
          const nonEmptyRows = sheetData.filter((row) => {
            return row && row.some((cell) => cell && cell.v !== undefined && cell.v !== null && cell.v !== "")
          })
          totalRowsEl.textContent = nonEmptyRows.length > 0 ? nonEmptyRows.length - 1 : 0
        } else {
          totalRowsEl.textContent = "0"
        }
      } catch (error) {
        totalRowsEl.textContent = "0"
      }
    }
  }
})

function logout() {
  sessionStorage.clear()
  window.location.href = "login.html"
}

// Real-time clock for last sync
function updateSyncTime() {
  const syncElements = document.querySelectorAll(".stat-label")
  syncElements.forEach((el) => {
    if (el.textContent === "Última Sincronización") {
      const parent = el.closest(".stat-card")
      const valueEl = parent.querySelector(".stat-value")
      const minutes = Math.floor(Math.random() * 15) + 1
      valueEl.textContent = `Hace ${minutes} min`
    }
  })
}

setInterval(updateSyncTime, 60000)
