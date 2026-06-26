/* =========================================================
   Mock data — mirrors the content seen in the screenshots.
   Everything lives in window.DB
   ========================================================= */
window.DB = {

  company: {
    name: "SHREEMAY ASSOCIATES",
    tagline: "PROJECT MANAGEMENT | CONSTRUCTION | INTERIORS",
    customer: "Fiscal Ox Cloud Pvt Ltd",
  },

  user: { name: "Viral Parmar", role: "Project Manager" },

  /* ---------- Projects ---------- */
  projects: [
    { id: "demo", name: "Demo  Proj", client: "Siddhart Sarvaiya", status: "New", type: "INTERIOR", projectId: "100001784" },
    { id: "test1", name: "test1", client: "Siddhart Sarvaiya", status: "New", type: "INTERIOR", projectId: "100001790" },
  ],

  /* ---------- Master lists ---------- */
  structures: ["RCC", "Flooring", "Ceilling", "Bathroom"],
  agenciesMaster: [
    { name: "CIVIL", code: "CIV" },
    { name: "Electrician", code: "ELEC" },
    { name: "Plumber", code: "PLMB" },
    { name: "Lift/Elevator", code: "LIFT" },
    { name: "Water-Proofing", code: "WTP" },
    { name: "Fire & Safety", code: "FIRE" },
    { name: "HVAC", code: "HVAC" },
  ],
  meetingTypes: ["Physical", "Virtual"],

  /* ---------- Minutes of Meeting ---------- */
  meetings: [
    {
      id: "m1",
      topic: "furniture work, light Box change, bathroom shower area change",
      topicField: "bathroom shower area change",
      project: "Ravi patel",
      type: "Physical",
      location: "All Home",
      organizer: "Jenish Patel",
      start: "17/02/2026 05:00 PM",
      end: "17/02/2026 06:59 AM",
      datetime: "17/02/2026 05:00 PM",
      agenda: [],
      discussed: [],
      agreed: [],
    },
    {
      id: "m2",
      topic: "Meeting With FiscalOx :- Phase 2.0",
      topicField: "Meeting With FiscalOx :- Phase 2.0",
      project: "Fiscal Demo",
      type: "Physical",
      location: "On office",
      organizer: "Viral Parmar",
      start: "25/06/2026 06:00 AM",
      end: "25/06/2026 07:00 AM",
      datetime: "25/06/2026 06:00 AM",
      agenda: ["Po Sign not working"],
      discussed: [],
      agreed: [],
    },
    {
      id: "m3",
      topic: "Client changes",
      topicField: "Client changes",
      project: "G H Mention",
      type: "Physical",
      location: "Site office",
      organizer: "Viral Parmar",
      start: "10/01/2026 11:00 AM",
      end: "10/01/2026 12:00 PM",
      datetime: "10/01/2026 11:00 AM",
      agenda: ["Layout revisions"],
      discussed: [],
      agreed: [],
    },
    {
      id: "m4",
      topic: "Beam depth size changes",
      topicField: "Beam depth size changes",
      project: "Samanvay Reality",
      type: "Physical",
      location: "Samanvay site",
      organizer: "Viral Parmar",
      start: "05/01/2026 03:30 PM",
      end: "05/01/2026 04:30 PM",
      datetime: "05/01/2026 03:30 PM",
      agenda: ["Structural review"],
      discussed: [],
      agreed: [],
    },
    {
      id: "m5",
      topic: "Training meeting",
      topicField: "Training meeting",
      project: "Demo  Proj",
      type: "Virtual",
      location: "Alkapuri",
      organizer: "Viral Parmar",
      start: "23/11/2025 11:49 AM",
      end: "27/11/2025 11:49 AM",
      datetime: "23/11/2025 11:49 AM",
      agenda: ["Adda"],
      discussed: ["askdkl"],
      agreed: [{ remarks: "satjj", person: "", date: "" }],
    },
  ],

  /* ---------- Per-project data (keyed by project id) ---------- */
  projectData: {
    demo: {

      /* DPR records */
      dpr: [
        { date: "08/02/2026", agencies: 1, personnel: 77,
          manpower: [{ name: "CIVIL (CIV)", skilled: 55, unskilled: 22 }],
          today: [{ name: "Abcd", remarks: "Abcd" }],
          tomorrow: [{ name: "Abcd", remarks: "Abcd" }] },
        { date: "19/01/2026", agencies: 1, personnel: 2580,
          manpower: [{ name: "CIVIL (CIV)", skilled: 2000, unskilled: 580 }],
          today: [{ name: "Slab work", remarks: "Ongoing" }],
          tomorrow: [{ name: "Curing", remarks: "Planned" }] },
        { date: "30/12/2025", agencies: 10, personnel: 100,
          manpower: [{ name: "CIVIL (CIV)", skilled: 60, unskilled: 40 }],
          today: [{ name: "Multiple", remarks: "All agencies" }],
          tomorrow: [{ name: "Continue", remarks: "—" }] },
        { date: "27/12/2025", agencies: 2, personnel: 37,
          manpower: [{ name: "CIVIL (CIV)", skilled: 25, unskilled: 12 }],
          today: [{ name: "Plaster", remarks: "Wing A" }],
          tomorrow: [{ name: "Plaster", remarks: "Wing B" }] },
        { date: "24/12/2025", agencies: 16, personnel: 364,
          manpower: [{ name: "CIVIL (CIV)", skilled: 200, unskilled: 164 }],
          today: [{ name: "Mass work", remarks: "Peak" }],
          tomorrow: [{ name: "Mass work", remarks: "Peak" }] },
        { date: "23/12/2025", agencies: 1, personnel: 7,
          manpower: [{ name: "CIVIL (CIV)", skilled: 5, unskilled: 2 }],
          today: [{ name: "Marking", remarks: "Done" }],
          tomorrow: [{ name: "Excavation", remarks: "Start" }] },
        { date: "22/12/2025", agencies: 1, personnel: 7,
          manpower: [{ name: "CIVIL (CIV)", skilled: 5, unskilled: 2 }],
          today: [{ name: "Survey", remarks: "Done" }],
          tomorrow: [{ name: "Marking", remarks: "Plan" }] },
        { date: "19/12/2025", agencies: 1, personnel: 7,
          manpower: [{ name: "CIVIL (CIV)", skilled: 5, unskilled: 2 }],
          today: [{ name: "Site setup", remarks: "Done" }],
          tomorrow: [{ name: "Survey", remarks: "Plan" }] },
      ],

      /* Documents */
      folders: [
        { id: "fd1", name: "Approved Quotes",                      date: "01/01/2026", locked: true,  files: [] },
        { id: "fd2", name: "Site Pics",                            date: "01/01/2026", locked: true,  files: [] },
        { id: "fd3", name: "Plumbing & Electrical Photographic Docs", date: "01/01/2026", locked: true, files: [] },
        { id: "f1",  name: "PHASE 2.0", date: "25/06/2026",
          files: [{ id: "fl1", name: "1000043803.jpg", desc: "Phase 2 requirements", date: "25/06/2026", type: "image" }] },
      ],

      /* SOPs */
      sop: [
        { id: "SOP/0001", structure: "Flooring", date: "07/12/2025",
          agencies: ["CIVIL", "Electrician", "Plumber", "Lift/Elevator"],
          checkpoints: [
            "For structure Engineer", "SOP for Before Flooring",
            "Check for Plumbing line if any", "Check for AC Drain line If any",
            "Check for Pestcontrol Pipe If any", "Check For Electrical Pipe If any",
            "Gas Line For Kitchen", "IF Island Kitchen",
            "Electrical Floor Point", "Plumbing Floor Point",
            "Gas Line", "Drain Floor Point",
          ],
          agencyList: [
            { name: "CIVIL", code: "CIV", signed: true },
            { name: "Electrician", code: "ELEC", signed: false },
            { name: "Plumber", code: "PLMB", signed: false },
            { name: "Lift/Elevator", code: "LIFT", signed: false },
          ] },
        { id: "SOP/0002", structure: "Bathroom", date: "23/12/2025",
          agencies: ["CIVIL", "Plumber"], checkpoints: ["Waterproofing check", "Slope check", "Drain test"],
          agencyList: [ { name: "CIVIL", code: "CIV", signed: false }, { name: "Plumber", code: "PLMB", signed: false } ] },
        { id: "SOP/0003", structure: "RCC", date: "30/12/2025",
          agencies: ["CIVIL"], checkpoints: ["Reinforcement check", "Cover blocks", "Shuttering"],
          agencyList: [ { name: "CIVIL", code: "CIV", signed: false } ] },
        { id: "SOP/0004", structure: "Flooring", date: "23/01/2026",
          agencies: ["CIVIL", "Electrician"], checkpoints: ["Level check", "Tile layout"],
          agencyList: [ { name: "CIVIL", code: "CIV", signed: false }, { name: "Electrician", code: "ELEC", signed: false } ] },
        { id: "SOP/0005", structure: "RCC", date: "01/01/2026",
          agencies: ["CIVIL"], checkpoints: ["Concrete grade", "Slump test"],
          agencyList: [ { name: "CIVIL", code: "CIV", signed: false } ] },
      ],

      /* Queries */
      query: [
        { id: "Query/0001", date: "01/12/2025", client: "Siddhart Sarvaiya",
          rows: [{ q: "Abc", r: "Ard" }] },
        { id: "Query/0002", date: "30/12/2025", client: "Siddhart Sarvaiya", rows: [] },
        { id: "Query/0003", date: "23/01/2026", client: "Siddhart Sarvaiya",
          rows: [{ q: "Tile selection pending", r: "Will share by Friday" }] },
        { id: "Query/0004", date: "27/04/2026", client: "Siddhart Sarvaiya",
          rows: [{ q: "Paint shade confirmation", r: "Approved" }] },
        { id: "Query/0005", date: "28/04/2026", client: "Siddhart Sarvaiya", rows: [] },
      ],

      /* Pending Work Points */
      pendingWorks: [
        { id: "pw1", title: "Fix bathroom waterproofing – Wing B", priority: "High",   status: "Open",        dueDate: "30/06/2026", description: "Re-apply waterproofing membrane in bathroom area of Wing B before tile laying.", attachments: [] },
        { id: "pw2", title: "Electrical conduit routing – 3rd floor",  priority: "Medium", status: "In Progress", dueDate: "05/07/2026", description: "Route conduit from DB to all switch-board points on the 3rd floor.", attachments: [] },
        { id: "pw3", title: "Plaster patch – staircase lobby",         priority: "Low",    status: "Done",        dueDate: "20/06/2026", description: "Patch cracks in staircase lobby plaster before painting.", attachments: [] },
      ],

      /* Purchase Orders */
      po: [
        { id: "PO-0001", orderDate: "06/12/2025", expiry: "19/12/2025", supplier: "Abc",
          engineer: "Bipin", terms: "Gege", status: "DRAFT", signed: true,
          items: [{ product: "123", qty: 1, uom: "kg", price: 10000 }] },
        { id: "PO-0002", orderDate: "19/12/2025", expiry: "", supplier: "", engineer: "",
          terms: "", status: "DRAFT", signed: false,
          items: [{ product: "Cement", qty: 1, uom: "bag", price: 10 }] },
        { id: "PO-0003", orderDate: "30/12/2025", expiry: "30/12/2025", supplier: "", engineer: "",
          terms: "", status: "DRAFT", signed: false,
          items: [{ product: "Sand", qty: 1, uom: "cft", price: 100 }] },
        { id: "PO-0004", orderDate: "23/01/2026", expiry: "23/09/2026", supplier: "Abc", engineer: "Xyz",
          terms: "Net 30", status: "DRAFT", signed: false,
          items: [{ product: "Steel", qty: 100, uom: "kg", price: 50 }] },
        { id: "PO-0005", orderDate: "06/04/2026", expiry: "", supplier: "Abc", engineer: "Chaitanya",
          terms: "Advance", status: "DRAFT", signed: false,
          items: [{ product: "Paint", qty: 1, uom: "ltr", price: 100 }] },
      ],
    },

    test1: {
      dpr: [],
      folders: [
        { id: "fd1", name: "Approved Quotes",                         date: "01/01/2026", locked: true, files: [] },
        { id: "fd2", name: "Site Pics",                               date: "01/01/2026", locked: true, files: [] },
        { id: "fd3", name: "Plumbing & Electrical Photographic Docs", date: "01/01/2026", locked: true, files: [] },
      ],
      sop: [], query: [], po: [], pendingWorks: [],
    },
  },
};

/* ---------- Leave Management ---------- */
DB.leave = {
  types: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Comp Off'],
  typeShort: { 'Casual Leave': 'CL', 'Sick Leave': 'SL', 'Earned Leave': 'EL', 'Comp Off': 'CO' },
  employees: [
    { id: 'e1', name: 'Viral Parmar',  role: 'Project Manager', balance: { CL: 12, SL: 8,  EL: 15, CO: 2 } },
    { id: 'e2', name: 'Jenish Patel',  role: 'Site Engineer',   balance: { CL: 8,  SL: 6,  EL: 10, CO: 0 } },
    { id: 'e3', name: 'Bipin Shah',    role: 'Civil Engineer',  balance: { CL: 10, SL: 8,  EL: 12, CO: 1 } },
  ],
  applications: [
    { id: 'la1', empId: 'e2', empName: 'Jenish Patel',  type: 'Casual Leave', from: '28/06/2026', to: '29/06/2026', days: 2, reason: 'Family function',  status: 'pending',  appliedOn: '24/06/2026', approvedBy: '' },
    { id: 'la2', empId: 'e3', empName: 'Bipin Shah',    type: 'Sick Leave',   from: '20/06/2026', to: '20/06/2026', days: 1, reason: 'Fever',            status: 'approved', appliedOn: '19/06/2026', approvedBy: 'Viral Parmar' },
    { id: 'la3', empId: 'e1', empName: 'Viral Parmar',  type: 'Earned Leave', from: '15/07/2026', to: '18/07/2026', days: 4, reason: 'Annual vacation',  status: 'pending',  appliedOn: '22/06/2026', approvedBy: '' },
    { id: 'la4', empId: 'e2', empName: 'Jenish Patel',  type: 'Comp Off',     from: '10/06/2026', to: '10/06/2026', days: 1, reason: 'Worked on Sunday', status: 'rejected', appliedOn: '08/06/2026', approvedBy: 'Viral Parmar' },
  ],
};

/* helpers */
DB.getProject = (id) => DB.projects.find(p => p.id === id) || DB.projects[0];
DB.getProjectData = (id) => DB.projectData[id] || DB.projectData.demo;
DB.getMeeting = (id) => DB.meetings.find(m => m.id === id);
DB.money = (n) => "₹ " + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
