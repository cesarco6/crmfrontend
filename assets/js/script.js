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
      setTimeout(initializeLuckysheet, 500)
      return
    }

    const options = {
      container: "luckysheet",
      lang: "es",
      title: "Área de Trabajo CRM",
      showinfobar: false,
      showsheetbar: true,
      showstatisticBar: true,
      sheetFormulaBar: true,
      enableAddRow: true,
      enableAddCol: true,
      userInfo: false,
      showConfigWindowResize: true,
      allowEdit: true,
      allowCopy: true,
      showtoolbar: true,
      showtoolbarConfig: {
        undoRedo: true,
        paintFormat: true,
        currencyFormat: true,
        percentageFormat: true,
        numberDecrease: true,
        numberIncrease: true,
        moreFormats: true,
        font: true,
        fontSize: true,
        bold: true,
        italic: true,
        strikethrough: true,
        underline: true,
        textColor: true,
        fillColor: true,
        border: true,
        mergeCell: true,
        horizontalAlignMode: true,
        verticalAlignMode: true,
        textWrapMode: true,
        textRotateMode: true,
      },
      data: [
        {
          name: "Hoja1",
          color: "",
          status: 1,
          order: 0,
          data: [],
          config: {
            columnlen: {
              0: 100,
              1: 100,
              2: 100,
              3: 100,
              4: 100,
            },
          },
        },
      ],
    }

    try {
      luckysheet.create(options)
      window.dispatchEvent(new Event("resize"));
      console.log("[v0] Luckysheet initialized successfully")
      showToast("Hoja de cálculo lista", "success")
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

  // File upload functionality
  function setupFileUpload() {
    const dropZone = document.getElementById("dropZone")
    const dropZoneAgent = document.getElementById("dropZoneAgent")
    const fileInput = document.getElementById("fileInput")
    const fileInputAgent = document.getElementById("fileInputAgent")

    // Setup for director
    if (dropZone && fileInput) {
      setupDropZone(dropZone, fileInput)
    }

    // Setup for agent
    if (dropZoneAgent && fileInputAgent) {
      setupDropZone(dropZoneAgent, fileInputAgent)
    }
  }

  function setupDropZone(dropZone, fileInput) {
    // Prevent default drag behaviors
    ;["dragenter", "dragover", "dragleave", "drop"]
      .forEach((eventName) => {
        dropZone.addEventListener(eventName, preventDefaults, false)
        document.body.addEventListener(eventName, preventDefaults, false)
      })

    [
      // Highlight drop zone when item is dragged over it
      ("dragenter", "dragover")
    ].forEach((eventName) => {
      dropZone.addEventListener(
        eventName,
        () => {
          dropZone.classList.add("dragover")
        },
        false,
      )
    })

    [("dragleave", "drop")].forEach((eventName) => {
      dropZone.addEventListener(
        eventName,
        () => {
          dropZone.classList.remove("dragover")
        },
        false,
      )
    })

    // Handle dropped files
    dropZone.addEventListener(
      "drop",
      (e) => {
        const files = e.dataTransfer.files
        handleFiles(files)
      },
      false,
    )

    // Handle file input change
    fileInput.addEventListener("change", (e) => {
      const files = e.target.files
      handleFiles(files)
    })
  }

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleFiles(files) {
    if (files.length === 0) return

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        uploadFile(file)
      }
    })
  }

  function validateFile(file) {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    const validExtensions = [".csv", ".xls", ".xlsx"]

    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      showToast(`Formato no soportado: ${file.name}`, "warning")
      return false
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      showToast(`Archivo muy grande: ${file.name}. Máximo 10MB`, "warning")
      return false
    }

    return true
  }

  function uploadFile(file) {
    showToast(`Procesando ${file.name}...`, "info")

    // Simulate file processing
    setTimeout(() => {
      const randomSuccess = Math.random() > 0.1
      if (randomSuccess) {
        showToast(`${file.name} importado exitosamente`, "success")
      } else {
        showToast(`Error al importar ${file.name}`, "warning")
      }
    }, 2000)
  }

  window.showValidationRules = () => {
    showToast("Abriendo guía de validación...", "info")
    setTimeout(() => {
      alert(
        "Reglas de Validación:\n\n" +
        "1. Email: Formato válido requerido\n" +
        "2. Teléfono: 10 dígitos\n" +
        "3. Empresa: Campo obligatorio\n" +
        "4. Contacto: Nombre completo\n" +
        "5. Fecha: Formato YYYY-MM-DD\n\n" +
        "Descarga las plantillas para ver ejemplos.",
      )
    }, 500)
  }

  window.downloadTemplate = (type) => {
    showToast(`Descargando plantilla de ${type}...`, "info")

    let csvContent = ""

    switch (type) {
      case "leads":
        csvContent = "Empresa,Contacto,Email,Teléfono,Industria,Estado,Prioridad\n"
        csvContent += "Ejemplo Corp,Juan Pérez,jpererez@ejemplo.com,5551234567,Manufactura,Nuevo,Alta\n"
        break
      case "clientes":
        csvContent = "Empresa,Contacto,Email,Teléfono,Industria,Valor_Total,Estado\n"
        csvContent += "Cliente Ejemplo,María García,mgarcia@cliente.com,5559876543,Tecnología,150000,Activo\n"
        break
      case "contactos":
        csvContent = "Nombre,Apellido,Email,Teléfono,Empresa,Cargo\n"
        csvContent += "Carlos,López,clopez@empresa.com,5555551234,Empresa XYZ,Gerente\n"
        break
      case "oportunidades":
        csvContent = "Cliente,Etapa,Valor,Probabilidad,Fecha_Cierre,Producto\n"
        csvContent += "Cliente ABC,Negociación,85000,75,2025-04-15,Láser Industrial\n"
        break
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `plantilla_${type}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      showToast(`Plantilla de ${type} descargada`, "success")
    }, 500)
  }

  window.downloadReport = (filename) => {
    showToast(`Descargando reporte de ${filename}...`, "info")
    setTimeout(() => {
      showToast("Reporte descargado", "success")
    }, 1000)
  }

  setupFileUpload()
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
