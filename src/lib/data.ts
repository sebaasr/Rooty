export const SUBJECTS = [
  "Mathematics","Chemistry","Biology","Writing","History",
  "Political Science","Computer Science","Physics","Spanish",
  "Art History","Environmental Studies","Economics","Psychology","Sociology",
]

export const TUTORS = [
  { id:1, name:"Maya Chen",       avatar:"MC", subjects:["Mathematics","Chemistry","Physics"],           bio:"Junior at NCF studying Math & Chemistry. Experienced in Calc I–III, Diff Eq, and General Chemistry.",                                                    rating:4.9, reviews:34, availability:["Mon 2–4pm","Wed 10am–12pm","Fri 1–3pm"],   mode:["In-Person","Online"], hours:12, hoursMax:20, weeklySessionsUsed:3, weeklySessionLimit:4, rate:12 },
  { id:2, name:"Jordan Williams", avatar:"JW", subjects:["Writing","History","Art History"],              bio:"Senior concentrating in Literature and History. Specializes in essay structure, thesis development, and research methodology.",                               rating:4.7, reviews:28, availability:["Tue 11am–1pm","Thu 3–5pm","Fri 10am–12pm"],    mode:["In-Person"],          hours:8,  hoursMax:15, weeklySessionsUsed:2, weeklySessionLimit:4, rate:12 },
  { id:3, name:"Sam Patel",       avatar:"SP", subjects:["Biology","Chemistry","Psychology"],             bio:"Pre-med student with strong background in life sciences. Can help with cell bio, organic chemistry, and introductory psych.",                                rating:4.8, reviews:41, availability:["Mon 10am–12pm","Wed 2–4pm","Sat 9–11am"],      mode:["Online"],             hours:18, hoursMax:20, weeklySessionsUsed:4, weeklySessionLimit:4, rate:12 },
  { id:4, name:"Aisha Johnson",   avatar:"AJ", subjects:["Political Science","Sociology","Economics"],    bio:"Graduate-track student specializing in political theory and social research methods. Thesis writer with strong analytical skills.",                         rating:5.0, reviews:19, availability:["Tue 9–11am","Thu 1–3pm"],                         mode:["In-Person","Online"], hours:6,  hoursMax:10, weeklySessionsUsed:1, weeklySessionLimit:4, rate:12 },
  { id:5, name:"Kai Anderson",    avatar:"KA", subjects:["Computer Science","Mathematics","Physics"],     bio:"CS concentrator building projects in Python, Java, and web dev. Great at explaining algorithms and data structures simply.",                                 rating:4.6, reviews:22, availability:["Mon 4–6pm","Wed 4–6pm","Thu 6–8pm"],            mode:["Online"],             hours:14, hoursMax:20, weeklySessionsUsed:2, weeklySessionLimit:4, rate:12 },
  { id:6, name:"Priya Sharma",    avatar:"PS", subjects:["Environmental Studies","Biology","Economics"],  bio:"Environmental Studies senior with a focus on ecology and sustainability policy. Research assistant for Dr. Torres.",                                          rating:4.7, reviews:15, availability:["Tue 2–4pm","Fri 3–5pm"],                          mode:["In-Person","Online"], hours:10, hoursMax:15, weeklySessionsUsed:1, weeklySessionLimit:4, rate:12 },
]

export const PENDING_TUTORS = [
  { id:101, name:"Leo Martinez", avatar:"LM", subjects:["Spanish","History"],                   bio:"Native Spanish speaker, fluent in both Castilian and Latin American dialects. History minor with a focus on Latin America.", appliedDate:"Apr 17, 2026", gpa:"3.8", year:"Sophomore", qualifications:"TA in SPAN 101 last semester" },
  { id:102, name:"Ella Nguyen",  avatar:"EN", subjects:["Mathematics","Computer Science"],      bio:"Math and CS double concentrator. Strong in linear algebra, discrete math, and Python.", appliedDate:"Apr 18, 2026", gpa:"3.9", year:"Junior", qualifications:"Grader for MATH 201" },
  { id:103, name:"Marcus Reed",  avatar:"MR", subjects:["Writing","Sociology","Political Science"], bio:"Senior writing thesis on political philosophy. Experienced writing tutor from high school.", appliedDate:"Apr 19, 2026", gpa:"3.7", year:"Senior", qualifications:"Writing Center volunteer 2 years" },
]

export const SESSIONS = [
  { id:1, tutor:"Maya Chen",      avatar:"MC", subject:"Mathematics",       date:"Apr 14, 2026", time:"2:00–3:30pm",     mode:"In-Person", location:"Hamilton Center · Room 101",   meetingType:null,   meetingLink:null,                                  status:"completed", notes:"Worked through Calc III integration by parts. Great session.", rating:5 },
  { id:2, tutor:"Jordan Williams",avatar:"JW", subject:"Writing",           date:"Apr 10, 2026", time:"11:00am–12:00pm", mode:"In-Person", location:"Caples Basement Study Room",    meetingType:null,   meetingLink:null,                                  status:"completed", notes:"Essay outline for POL 301 paper. Helped a lot with thesis statement.", rating:4 },
  { id:3, tutor:"Sam Patel",      avatar:"SP", subject:"Biology",           date:"Apr 8, 2026",  time:"2:00–3:00pm",     mode:"Online",    location:null,                            meetingType:"zoom", meetingLink:"https://zoom.us/j/5551234567",         status:"completed", notes:"Cell membrane structure and function review for exam.", rating:5 },
  { id:4, tutor:"Maya Chen",      avatar:"MC", subject:"Chemistry",         date:"Apr 22, 2026", time:"2:00–3:30pm",     mode:"In-Person", location:"Hamilton Center · Room 101",   meetingType:null,   meetingLink:null,                                  status:"upcoming",  notes:"", rating:0 },
  { id:5, tutor:"Aisha Johnson",  avatar:"AJ", subject:"Political Science", date:"Apr 24, 2026", time:"9:00–10:00am",    mode:"Online",    location:null,                            meetingType:"meet", meetingLink:"https://meet.google.com/rxq-cndf-bkp", status:"upcoming",  notes:"", rating:0 },
]

export const TUTOR_SESSIONS = [
  { id:10, student:"Riley Thompson", studentAvatar:"RT", subject:"Mathematics",       date:"Apr 22, 2026", time:"2:00–3:30pm",     mode:"In-Person", location:"Hamilton Center · Room 101", meetingType:null,   meetingLink:null,                                  status:"upcoming"  },
  { id:11, student:"Alex Kim",       studentAvatar:"AK", subject:"Chemistry",         date:"Apr 23, 2026", time:"10:00–11:00am",   mode:"Online",    location:null,                         meetingType:"meet", meetingLink:"https://meet.google.com/xyz-abcd-efg",  status:"upcoming"  },
  { id:12, student:"Dana Flores",    studentAvatar:"DF", subject:"Physics",           date:"Apr 24, 2026", time:"1:00–2:00pm",     mode:"In-Person", location:"Library · Study Room B",    meetingType:null,   meetingLink:null,                                  status:"upcoming"  },
  { id:13, student:"Riley Thompson", studentAvatar:"RT", subject:"Mathematics",       date:"Apr 17, 2026", time:"2:00–3:30pm",     mode:"In-Person", location:"Hamilton Center · Room 101", meetingType:null,   meetingLink:null,                                  status:"completed" },
  { id:14, student:"Morgan Lee",     studentAvatar:"ML", subject:"Chemistry",         date:"Apr 15, 2026", time:"10:00–11:00am",   mode:"Online",    location:null,                         meetingType:"zoom", meetingLink:"https://zoom.us/j/5551234567",          status:"completed" },
]

export const ADMIN_STATS = {
  activeTutors: 24,
  sessionsThisWeek: 47,
  avgRating: 4.8,
  noShowRate: 3.2,
  studentsServed: 98,
}

export const WEEKLY_DATA = [
  { week:"Mar 24", sessions:32 },
  { week:"Mar 31", sessions:41 },
  { week:"Apr 7",  sessions:38 },
  { week:"Apr 14", sessions:47 },
  { week:"Apr 21", sessions:52 },
]

export const SUBJECT_DATA = [
  { subject:"Mathematics", sessions:28 },
  { subject:"Writing",     sessions:22 },
  { subject:"Biology",     sessions:18 },
  { subject:"Chemistry",   sessions:16 },
  { subject:"CS",          sessions:12 },
  { subject:"Other",       sessions:24 },
]

// Weekly session limits
export const SESSION_POLICY = {
  studentWeeklySessionLimit: 3,
  tutorWeeklySessionLimit:   4,
  semesterSessionCap:        24,
  tutorSemesterHourCap:      80,
  semesterProgress:          0.69,
}

// Current student's week (Riley Sanchez demo)
export const STUDENT_WEEK = {
  sessionsUsed:  2,
  sessionLimit:  3,
  hoursUsed:     3.0,
  hourLimit:     4.5,
}

// Budget
export const BUDGET_DATA = {
  total:         80000,
  ytdSpent:      15792,
  weeklyBurn:    1488,
  weeklyTarget:  5000,
  projected:     26784,
  semesterWeeks: 16,
  currentWeek:   11,
  breakdown: [
    { label:"Tutor Pay (YTD)",         amount:13392, color:"var(--blue)"  },
    { label:"Admin Tools",             amount:1200,  color:"var(--gold)"  },
    { label:"Training & Onboarding",   amount:800,   color:"#059669"      },
    { label:"Misc / Contingency",      amount:400,   color:"#7C3AED"      },
  ],
  weeklyHistory: [
    { week:"Mar 24", amount:1344 },
    { week:"Mar 31", amount:1488 },
    { week:"Apr 7",  amount:1392 },
    { week:"Apr 14", amount:1536 },
    { week:"Apr 21", amount:1632 },
  ],
}

// Hiring pipeline
export const HIRING_PIPELINE = [
  { id:201, name:"Leo Martinez", avatar:"LM", stage:"Under Review",        subjects:["Spanish","History"],                  appliedDate:"Apr 17", gpa:"3.8", year:"Sophomore" },
  { id:202, name:"Ella Nguyen",  avatar:"EN", stage:"Interview Scheduled", subjects:["Mathematics","Computer Science"],     appliedDate:"Apr 18", gpa:"3.9", year:"Junior"   },
  { id:203, name:"Marcus Reed",  avatar:"MR", stage:"Applied",             subjects:["Writing","Sociology"],                appliedDate:"Apr 19", gpa:"3.7", year:"Senior"   },
  { id:204, name:"Sofia Reyes",  avatar:"SR", stage:"Applied",             subjects:["Biology","Chemistry"],                appliedDate:"Apr 20", gpa:"3.6", year:"Junior"   },
  { id:205, name:"Daniel Park",  avatar:"DP", stage:"Offer Extended",      subjects:["Computer Science","Mathematics"],     appliedDate:"Apr 12", gpa:"3.9", year:"Senior"   },
  { id:206, name:"Nadia Hassan", avatar:"NH", stage:"Applied",             subjects:["Economics","Political Science"],      appliedDate:"Apr 21", gpa:"3.5", year:"Sophomore"},
  { id:207, name:"Tyler Brooks", avatar:"TB", stage:"Under Review",        subjects:["Physics"],                            appliedDate:"Apr 15", gpa:"3.7", year:"Junior"   },
  { id:208, name:"Amara Diallo", avatar:"AD", stage:"Applied",             subjects:["French","Art History"],               appliedDate:"Apr 22", gpa:"3.8", year:"Sophomore"},
]

export const TUTOR_REQUIREMENTS = [
  { title:"GPA Requirement",         desc:"Minimum 3.5 cumulative GPA — unofficial transcript required at application" },
  { title:"Year Standing",           desc:"Sophomore standing or higher; seniors preferred for upper-division subjects" },
  { title:"Subject Proficiency",     desc:"A or A− in the subject(s) you wish to tutor, verified by faculty recommendation" },
  { title:"Faculty Recommendation",  desc:"One letter from a faculty member in the relevant subject area (email referral accepted)" },
  { title:"Availability",            desc:"Minimum 4 hours per week; commitment for the full semester required" },
  { title:"Tutor Training",          desc:"Complete the 2-hour Rooty Tutor Orientation module before your first session" },
  { title:"Background Check",        desc:"NCF HR will coordinate a standard background check upon offer acceptance" },
]
