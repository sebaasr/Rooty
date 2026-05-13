export const SUBJECTS = [
  "Mathematics","Chemistry","Biology","Writing","History",
  "Political Science","Computer Science","Physics","Spanish",
  "Art History","Environmental Studies","Economics","Psychology","Sociology",
]

export const TUTORS = [
  { id:1, name:"Maya Chen",       avatar:"MC", subjects:["Mathematics","Chemistry","Physics"],           bio:"Junior at NCF studying Math & Chemistry. Experienced in Calc I–III, Diff Eq, and General Chemistry.",                                                    rating:4.9, reviews:34, availability:["Mon 2–4pm","Wed 10am–12pm","Fri 1–3pm"],   mode:["In-Person","Online"], hours:12, hoursMax:20, weeklySessionsUsed:3, weeklySessionLimit:4, rate:12, crla:"Level II"     },
  { id:2, name:"Jordan Williams", avatar:"JW", subjects:["Writing","History","Art History"],              bio:"Senior concentrating in Literature and History. Specializes in essay structure, thesis development, and research methodology.",                               rating:4.7, reviews:28, availability:["Tue 11am–1pm","Thu 3–5pm","Fri 10am–12pm"],    mode:["In-Person"],          hours:8,  hoursMax:15, weeklySessionsUsed:2, weeklySessionLimit:4, rate:12, crla:"Level I"      },
  { id:3, name:"Sam Patel",       avatar:"SP", subjects:["Biology","Chemistry","Psychology"],             bio:"Pre-med student with strong background in life sciences. Can help with cell bio, organic chemistry, and introductory psych.",                                rating:4.8, reviews:41, availability:["Mon 10am–12pm","Wed 2–4pm","Sat 9–11am"],      mode:["Online"],             hours:18, hoursMax:20, weeklySessionsUsed:4, weeklySessionLimit:4, rate:12, crla:"Level II"     },
  { id:4, name:"Aisha Johnson",   avatar:"AJ", subjects:["Political Science","Sociology","Economics"],    bio:"Graduate-track student specializing in political theory and social research methods. Thesis writer with strong analytical skills.",                         rating:5.0, reviews:19, availability:["Tue 9–11am","Thu 1–3pm"],                         mode:["In-Person","Online"], hours:6,  hoursMax:10, weeklySessionsUsed:1, weeklySessionLimit:4, rate:12, crla:"In Progress"  },
  { id:5, name:"Kai Anderson",    avatar:"KA", subjects:["Computer Science","Mathematics","Physics"],     bio:"CS concentrator building projects in Python, Java, and web dev. Great at explaining algorithms and data structures simply.",                                 rating:4.6, reviews:22, availability:["Mon 4–6pm","Wed 4–6pm","Thu 6–8pm"],            mode:["Online"],             hours:14, hoursMax:20, weeklySessionsUsed:2, weeklySessionLimit:4, rate:12, crla:"None"         },
  { id:6, name:"Priya Sharma",    avatar:"PS", subjects:["Environmental Studies","Biology","Economics"],  bio:"Environmental Studies senior with a focus on ecology and sustainability policy. Research assistant for Dr. Torres.",                                          rating:4.7, reviews:15, availability:["Tue 2–4pm","Fri 3–5pm"],                          mode:["In-Person","Online"], hours:10, hoursMax:15, weeklySessionsUsed:1, weeklySessionLimit:4, rate:12, crla:"Level I"      },
]

export const PENDING_TUTORS = [
  { id:101, name:"Leo Martinez", avatar:"LM", subjects:["Spanish","History"],                   bio:"Native Spanish speaker, fluent in both Castilian and Latin American dialects. History minor with a focus on Latin America.", appliedDate:"Apr 17, 2026", gpa:"3.8", year:"Sophomore", qualifications:"TA in SPAN 101 last semester" },
  { id:102, name:"Ella Nguyen",  avatar:"EN", subjects:["Mathematics","Computer Science"],      bio:"Math and CS double concentrator. Strong in linear algebra, discrete math, and Python.", appliedDate:"Apr 18, 2026", gpa:"3.9", year:"Junior", qualifications:"Grader for MATH 201" },
  { id:103, name:"Marcus Reed",  avatar:"MR", subjects:["Writing","Sociology","Political Science"], bio:"Senior writing thesis on political philosophy. Experienced writing tutor from high school.", appliedDate:"Apr 19, 2026", gpa:"3.7", year:"Senior", qualifications:"Writing Center volunteer 2 years" },
]

export const SESSIONS = [
  { id:1, tutor:"Maya Chen",      avatar:"MC", subject:"Mathematics",       date:"Apr 14, 2026", time:"2:00–3:30pm",     mode:"In-Person", location:"Hume Library — Room 101",        meetingType:null,   meetingLink:null,                                  status:"completed", notes:"Worked through Calc III integration by parts. Great session.", rating:5 },
  { id:2, tutor:"Jordan Williams",avatar:"JW", subject:"Writing",           date:"Apr 10, 2026", time:"11:00am–12:00pm", mode:"In-Person", location:"Hume Library — Room 102",        meetingType:null,   meetingLink:null,                                  status:"completed", notes:"Essay outline for POL 301 paper. Helped a lot with thesis statement.", rating:4 },
  { id:3, tutor:"Sam Patel",      avatar:"SP", subject:"Biology",           date:"Apr 8, 2026",  time:"2:00–3:00pm",     mode:"Online",    location:null,                             meetingType:"zoom", meetingLink:"https://zoom.us/j/5551234567",         status:"completed", notes:"Cell membrane structure and function review for exam.", rating:5 },
  { id:4, tutor:"Maya Chen",      avatar:"MC", subject:"Chemistry",         date:"Apr 22, 2026", time:"2:00–3:30pm",     mode:"In-Person", location:"Hume Library — Room 101",        meetingType:null,   meetingLink:null,                                  status:"upcoming",  notes:"", rating:0 },
  { id:5, tutor:"Aisha Johnson",  avatar:"AJ", subject:"Political Science", date:"Apr 24, 2026", time:"9:00–10:00am",    mode:"Online",    location:null,                             meetingType:"meet", meetingLink:"https://meet.google.com/rxq-cndf-bkp", status:"upcoming",  notes:"", rating:0 },
]

export const TUTOR_SESSIONS = [
  { id:10, student:"Riley Thompson", studentAvatar:"RT", subject:"Mathematics",  date:"Apr 22, 2026", time:"2:00–3:30pm",   mode:"In-Person", location:"Hume Library — Room 101",       meetingType:null,   meetingLink:null,                                  status:"upcoming"  },
  { id:11, student:"Alex Kim",       studentAvatar:"AK", subject:"Chemistry",    date:"Apr 23, 2026", time:"10:00–11:00am", mode:"Online",    location:null,                            meetingType:"meet", meetingLink:"https://meet.google.com/xyz-abcd-efg",  status:"upcoming"  },
  { id:12, student:"Dana Flores",    studentAvatar:"DF", subject:"Physics",      date:"Apr 24, 2026", time:"1:00–2:00pm",   mode:"In-Person", location:"Pei Residence — Study Room A",  meetingType:null,   meetingLink:null,                                  status:"upcoming"  },
  { id:13, student:"Riley Thompson", studentAvatar:"RT", subject:"Mathematics",  date:"Apr 17, 2026", time:"2:00–3:30pm",   mode:"In-Person", location:"Hume Library — Room 101",       meetingType:null,   meetingLink:null,                                  status:"completed" },
  { id:14, student:"Morgan Lee",     studentAvatar:"ML", subject:"Chemistry",    date:"Apr 15, 2026", time:"10:00–11:00am", mode:"Online",    location:null,                            meetingType:"zoom", meetingLink:"https://zoom.us/j/5551234567",          status:"completed" },
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
  ytdSpent:      52340,
  committed:     8640,
  weeklyBurn:    5200,
  weeklyTarget:  5000,
  projected:     69980,
  semesterWeeks: 16,
  currentWeek:   11,
  monthLabels:   ["Jan","Feb","Mar","Apr"],
  monthlySpend:  [18200, 17400, 9400, 7340],
  breakdown: [
    { label:"Tutor Pay (YTD)",         amount:44890, color:"var(--blue)"  },
    { label:"Committed (Upcoming)",    amount:8640,  color:"var(--gold)"  },
    { label:"Training & Onboarding",   amount:3200,  color:"#059669"      },
    { label:"Admin & Tools",           amount:3610,  color:"#7C3AED"      },
  ],
  weeklyHistory: [
    { week:"Mar 24", amount:3200 },
    { week:"Mar 31", amount:3800 },
    { week:"Apr 7",  amount:4100 },
    { week:"Apr 14", amount:4400 },
    { week:"Apr 21", amount:5200 },
  ],
}

export const LOCATIONS = [
  { id:"lib-101",  name:"Hume Library — Room 101",       building:"Hume Library",       capacity:4, type:"study"     },
  { id:"lib-102",  name:"Hume Library — Room 102",       building:"Hume Library",       capacity:6, type:"study"     },
  { id:"pei-201",  name:"Pei Residence — Study Room A",  building:"Pei Residence Hall", capacity:4, type:"study"     },
  { id:"cook-110", name:"Cook Hall — Room 110",          building:"Cook Hall",          capacity:8, type:"classroom" },
  { id:"virtual",  name:"Online (Zoom/Meet)",            building:"Virtual",            capacity:1, type:"virtual"   },
]

export const LIMITS_CONFIG = {
  studentSessionsPerWeek:    3,
  studentSessionsPerSemester:30,
  tutorSessionsPerWeek:      8,
  tutorHoursPerWeek:         20,
  tutorHoursPerSemester:     200,
  semesterBudgetAlert:       75,
  sessionDurationMinutes:    60,
  advanceBookingDays:        14,
  cancellationHours:         24,
}

export const PEER_BENCHMARKS = [
  { school:"Wellesley College", metric:"Sessions/student/sem", value:"8.2",  ncf:"5.8",  higherIsBetter:true  },
  { school:"Reed College",      metric:"Tutor:Student ratio",  value:"1:12", ncf:"1:33", higherIsBetter:false },
  { school:"Eckerd College",    metric:"Student utilization",  value:"18%",  ncf:"12%",  higherIsBetter:true  },
  { school:"Rollins College",   metric:"Avg rating",           value:"4.7",  ncf:"4.8",  higherIsBetter:true  },
  { school:"Colby College",     metric:"No-show rate",         value:"4.1%", ncf:"3.2%", higherIsBetter:false },
]

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

// Faculty referrals sent to students
export const FACULTY_REFERRALS = [
  { id:601, from:"Prof. Maria Lopez", department:"Writing Program",    subject:"Writing",          date:"Apr 20, 2026", message:"I recommend you visit the Tutoring Center to get help with your research paper draft. The peer tutors are excellent with thesis development and argumentation.", priority:"recommended", booked:false },
  { id:602, from:"Prof. James Kim",   department:"Mathematics",        subject:"Mathematics",      date:"Apr 18, 2026", message:"Based on your recent quiz performance, I think a few sessions with a math tutor would really help you before the final exam.", priority:"suggested",    booked:true  },
]

// Tutor booking requests awaiting response (24-hr SLA tracking)
export const PENDING_REQUESTS = [
  { id:301, student:"Tyler Barnes", studentAvatar:"TB", subject:"Calculus III",    tutor:"Maya Chen",       tutorAvatar:"MC", requestedAt:"Apr 21, 2026 · 9:00am",  hoursAgo:38 },
  { id:302, student:"Lily Wong",    studentAvatar:"LW", subject:"Writing",         tutor:"Jordan Williams", tutorAvatar:"JW", requestedAt:"Apr 22, 2026 · 2:00pm",  hoursAgo:20 },
  { id:303, student:"Omar Hassan",  studentAvatar:"OH", subject:"Biology",         tutor:"Sam Patel",       tutorAvatar:"SP", requestedAt:"Apr 22, 2026 · 10:00am", hoursAgo:22 },
  { id:304, student:"Emma Torres",  studentAvatar:"ET", subject:"Chemistry",       tutor:"Maya Chen",       tutorAvatar:"MC", requestedAt:"Apr 23, 2026 · 9:00am",  hoursAgo:8  },
]

// Tutors who missed a scheduled session without canceling
export const TUTOR_NOSHOWS = [
  { id:401, tutor:"Jordan Williams", tutorAvatar:"JW", student:"Riley Thompson", subject:"Writing",          date:"Apr 10, 2026", time:"11:00am", totalNoShows:1 },
  { id:402, tutor:"Kai Anderson",    tutorAvatar:"KA", student:"Dana Flores",    subject:"Computer Science", date:"Apr 8, 2026",  time:"4:00pm",  totalNoShows:2 },
]

// Students who missed a booked session without sufficient notice
export const STUDENT_NOSHOWS = [
  { id:501, student:"Alex Kim",    studentAvatar:"AK", tutor:"Maya Chen",    subject:"Chemistry",        date:"Apr 15, 2026", time:"2:00pm",  totalNoShows:1 },
  { id:502, student:"Jordan Reed", studentAvatar:"JR", tutor:"Sam Patel",    subject:"Biology",          date:"Apr 12, 2026", time:"10:00am", totalNoShows:2 },
  { id:503, student:"Sam Wong",    studentAvatar:"SW", tutor:"Kai Anderson", subject:"Computer Science", date:"Apr 8, 2026",  time:"4:00pm",  totalNoShows:1 },
]

// Location usage for insights
export const LOCATION_STATS = [
  { name:"Hume Library — Room 101",      sessions:42, mode:"In-Person" },
  { name:"Hume Library — Room 102",      sessions:31, mode:"In-Person" },
  { name:"Online (Zoom / Meet)",         sessions:28, mode:"Online"    },
  { name:"Pei Residence — Study Room A", sessions:12, mode:"In-Person" },
  { name:"Cook Hall — Room 110",         sessions:7,  mode:"In-Person" },
]

// Chatbot / AI usage stats
export const CHATBOT_STATS = {
  totalQueries:      284,
  uniqueStudents:    61,
  resolutionRate:    78,
  avgQueriesPerUser: 4.7,
  topTopics: ["Booking help", "Session limits", "How to apply as tutor", "FERPA / data rights", "Cancellations"],
}

// Riley's semester-level stats
export const STUDENT_SEMESTER = {
  sessionsUsed: 14,
  sessionCap:   30,
  hoursUsed:    21.5,
  hourCap:      45,
  breakdown: [
    { subject:"Mathematics", sessions:6 },
    { subject:"Writing",     sessions:4 },
    { subject:"Biology",     sessions:3 },
    { subject:"Chemistry",   sessions:1 },
  ],
}

// Study Buddy opt-in pool
export const STUDY_BUDDY_POOL = [
  { id:701, name:"Alex Kim",    avatar:"AK", subject:"Mathematics", year:"Sophomore", mode:"In-Person", goals:"Calc II exam prep — looking for 2×/week partner",  matched:false },
  { id:702, name:"Dana Flores", avatar:"DF", subject:"Biology",     year:"Junior",    mode:"Online",    goals:"Cell biology — mid-terms and lab report review",     matched:false },
  { id:703, name:"Morgan Lee",  avatar:"ML", subject:"Writing",     year:"Senior",    mode:"Either",    goals:"Thesis draft editing — accountability partner",       matched:true  },
  { id:704, name:"Sam Wong",    avatar:"SW", subject:"Chemistry",   year:"Sophomore", mode:"In-Person", goals:"Orgo I problem sets, weekly study group preferred",   matched:false },
]

// Anonymous aggregated tutor feedback themes (no PII — shown to director)
export const ANONYMOUS_FEEDBACK = [
  { theme:"Explains concepts clearly",           count:47, sentiment:"positive"   },
  { theme:"Responsive and reliable",             count:38, sentiment:"positive"   },
  { theme:"Creates a comfortable environment",   count:31, sentiment:"positive"   },
  { theme:"Wish sessions were longer",           count:22, sentiment:"suggestion" },
  { theme:"More practice problems, please",      count:14, sentiment:"suggestion" },
  { theme:"Hard to find available slots",        count:11, sentiment:"negative"   },
]

// Weekly office hours hosted by tutors (drop-in, no booking required)
export const OFFICE_HOURS = [
  { id:801, tutor:"Maya Chen",       avatar:"MC", subject:"Mathematics",       day:"Monday",    time:"3:00–4:30pm", mode:"In-Person", location:"Hume Library — Room 101", spotsLeft:6, capacity:8, recurring:true  },
  { id:802, tutor:"Jordan Williams", avatar:"JW", subject:"Writing",           day:"Tuesday",   time:"1:00–2:30pm", mode:"In-Person", location:"Hume Library — Room 102", spotsLeft:3, capacity:6, recurring:true  },
  { id:803, tutor:"Sam Patel",       avatar:"SP", subject:"Biology",           day:"Wednesday", time:"4:00–5:30pm", mode:"Online",    location:null,                      spotsLeft:9, capacity:12, recurring:true },
  { id:804, tutor:"Aisha Johnson",   avatar:"AJ", subject:"Political Science", day:"Thursday",  time:"10:00–11:30am",mode:"In-Person",location:"Cook Hall — Room 110",    spotsLeft:5, capacity:8, recurring:true  },
  { id:805, tutor:"Kai Anderson",    avatar:"KA", subject:"Computer Science",  day:"Wednesday", time:"5:00–6:30pm", mode:"Online",    location:null,                      spotsLeft:7, capacity:10, recurring:true },
  { id:806, tutor:"Priya Sharma",    avatar:"PS", subject:"Environmental Studies",day:"Friday", time:"2:00–3:30pm", mode:"In-Person", location:"Pei Residence — Study Room A", spotsLeft:4, capacity:6, recurring:true },
  { id:807, tutor:"Maya Chen",       avatar:"MC", subject:"Chemistry",         day:"Friday",    time:"10:00–11:30am",mode:"Online",   location:null,                      spotsLeft:8, capacity:10, recurring:true },
]

// Conversations between students and tutors
export const CONVERSATIONS = [
  {
    id: 1,
    student: "Riley Sanchez", studentAvatar: "RS",
    tutor:   "Maya Chen",     tutorAvatar:   "MC",
    subject: "Mathematics",
    lastMessageAt: "Apr 22, 2026 · 3:14pm",
    messages: [
      { id:1, from:"student", text:"Hi Maya! Quick question about tomorrow's session — should I bring my textbook or will you have the problems ready?", time:"Apr 21 · 9:05am", read:true },
      { id:2, from:"tutor",   text:"Hey Riley! Bring your textbook if you have it, but don't worry if not — I'll have printed practice problems for integration by parts. See you tomorrow!", time:"Apr 21 · 9:47am", read:true },
      { id:3, from:"student", text:"Perfect, thanks! Also, is it okay if I bring a friend who's struggling with the same topic? She's not booked yet.", time:"Apr 21 · 10:02am", read:true },
      { id:4, from:"tutor",   text:"That's totally fine — just have her book a group session so it's on record. You can both get the group rate ($8/hr each).", time:"Apr 21 · 10:31am", read:true },
      { id:5, from:"student", text:"Great idea, I'll let her know. See you at 2pm!", time:"Apr 22 · 8:00am", read:true },
      { id:6, from:"tutor",   text:"See you then! Come to Hume Library Room 101.", time:"Apr 22 · 3:14pm", read:false },
    ],
  },
  {
    id: 2,
    student: "Riley Sanchez", studentAvatar: "RS",
    tutor:   "Jordan Williams", tutorAvatar: "JW",
    subject: "Writing",
    lastMessageAt: "Apr 20, 2026 · 11:22am",
    messages: [
      { id:1, from:"tutor",   text:"Hi Riley! Just a reminder that our session is tomorrow at 11am. Please bring a printed copy of your draft if possible — easier to mark up together.", time:"Apr 19 · 4:00pm", read:true },
      { id:2, from:"student", text:"Got it! I'll print it tonight. Should I email it to you in advance so you can read it first?", time:"Apr 19 · 6:33pm", read:true },
      { id:3, from:"tutor",   text:"That would be amazing, yes please! Send it to jordan.williams@ncf.edu and I'll jot some initial notes before we meet.", time:"Apr 19 · 7:10pm", read:true },
      { id:4, from:"student", text:"Just sent it over! It's a bit rough in the third paragraph but I think the thesis is solid.", time:"Apr 20 · 11:22am", read:false },
    ],
  },
]

// Most in-demand subjects by period
export const DEMAND_BY_PERIOD = {
  week:     [{ subject:"Mathematics",sessions:8  },{ subject:"Writing",sessions:6  },{ subject:"Biology",sessions:5  },{ subject:"Chemistry",sessions:4  },{ subject:"CS",sessions:3  }],
  month:    [{ subject:"Mathematics",sessions:28 },{ subject:"Writing",sessions:22 },{ subject:"Biology",sessions:18 },{ subject:"Chemistry",sessions:16 },{ subject:"CS",sessions:12 }],
  semester: [{ subject:"Mathematics",sessions:112},{ subject:"Writing",sessions:88 },{ subject:"Biology",sessions:74 },{ subject:"Chemistry",sessions:64 },{ subject:"CS",sessions:48 }],
  year:     [{ subject:"Mathematics",sessions:198},{ subject:"Writing",sessions:156},{ subject:"Biology",sessions:131},{ subject:"Chemistry",sessions:113},{ subject:"CS",sessions:84 }],
}
