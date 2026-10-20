\documentclass[10pt,a4paper]{article}

% =========================================================
% PACKAGES
% =========================================================
\usepackage[
    top=0.55in,
    bottom=0.55in,
    left=0.62in,
    right=0.62in
]{geometry}

\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{xcolor}
\usepackage{tabularx}

% =========================================================
% GENERAL FORMATTING
% =========================================================
\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}

\urlstyle{same}

% =========================================================
% SECTION FORMATTING
% =========================================================
\titleformat{\section}
    {\fontsize{11}{13}\selectfont\bfseries}
    {}
    {0pt}
    {}
    [\vspace{-3pt}\titlerule]

\titlespacing{\section}
    {0pt}
    {9pt}
    {5pt}

% =========================================================
% BULLET FORMATTING
% =========================================================
\setlist[itemize]{
    leftmargin=0.20in,
    itemsep=2.5pt,
    topsep=2pt,
    parsep=0pt,
    partopsep=0pt
}

% =========================================================
% CUSTOM COMMANDS
% =========================================================

\newcommand{\project}[2]{
    \textbf{\fontsize{10.5}{12}\selectfont #1}
    \hfill
    \href{#2}{\textbf{GitHub}}
}

\newcommand{\education}[2]{
    \textbf{#1}
    \hfill
    #2
}

% =========================================================
% DOCUMENT
% =========================================================

\begin{document}

% =========================================================
% HEADER
% =========================================================

\begin{center}
{\fontsize{21}{24}\selectfont\textbf{JATIN}}
\vspace{4pt}

{\fontsize{9.5}{11}\selectfont
    Delhi, India    \quad|\quad    +91 9319331978    \quad|\quad    \href{mailto:jatinkumar1234jarwal@gmail.com}{jatinkumar1234jarwal@gmail.com}
    }
\vspace{3pt}

{\fontsize{9.5}{11}\selectfont
    \href{https://github.com/jatinjarwal}{GitHub}    \quad|\quad    \href{https://www.linkedin.com/in/jatin-j-39a422359/}{LinkedIn}    \quad|\quad    \href{https://leetcode.com/u/Jatinjarwal/}{LeetCode}
    }
\end{center}

% =========================================================
% SUMMARY
% =========================================================

\section{SUMMARY}
Aspiring Backend Engineer with strong proficiency in building scalable RESTful APIs using Node.js, Express, and MongoDB. Experienced in optimizing backend performance through asynchronous message queues (BullMQ), caching strategies (Redis), and atomic database transactions. Adept at deploying containerized applications (Docker) on cloud infrastructure (AWS EC2, ECS) with robust security and proxy configurations (Nginx).

% =========================================================
% EDUCATION
% =========================================================

\section{EDUCATION}
\education {Netaji Subhas University of Technology (NSUT), Delhi} {2022--2026}
\vspace{1pt}
B.Tech. --- Instrumentation \& Control Engineering
\vspace{3pt}

\textbf{CBSE:} Class XII --- 83\% (2021) \hspace{15pt} Class X --- 87\% (2019)

% =========================================================
% TECHNICAL SKILLS
% =========================================================

\section{TECHNICAL SKILLS}
\textbf{Languages:} JavaScript, C++, SQL
\vspace{2pt}

\textbf{Backend \& Frameworks:} Node.js, Express.js, RESTful APIs, Mongoose
\vspace{2pt}

\textbf{Databases \& Queues:} MongoDB, MySQL, Redis, BullMQ
\vspace{2pt}

\textbf{Cloud \& DevOps:} AWS (EC2, ECS), Docker, Nginx, Git, GitHub, Postman
\vspace{2pt}

\textbf{Authentication \& Security:} JWT, bcrypt.js, Redis Rate Limiting
\vspace{2pt}

\textbf{Fundamentals:} Data Structures \& Algorithms, DBMS, OOP, Operating Systems, Computer Networks

% =========================================================
% PROJECTS
% =========================================================

\section{PROJECTS}

% -------------------- PROJECT 1 --------------------
\project {Video Streaming Platform --- Backend} {https://github.com/jatinjarwal/Youtube}
\vspace{2pt}

{\fontsize{9}{10.5}\selectfont \textit{ Node.js | Express | MongoDB | Redis | BullMQ | Docker | AWS EC2 | Nginx }}
\vspace{3pt}
\begin{itemize}
\item Engineered a scalable video streaming API deployed on an \textbf{AWS EC2} instance via \textbf{Docker} containers, utilizing an \textbf{Nginx} reverse proxy to handle secure web traffic and large multi-part file uploads.
\item Designed an asynchronous event-driven architecture using \textbf{BullMQ and Redis} to offload heavy \textbf{Cloudinary} media uploads and user subscription logic to isolated background worker processes.
\item Enforced strict database integrity across complex relational models (Likes, Comments, Playlists) by implementing \textbf{ACID-compliant Mongoose transactions} for cascading resource deletions.
\item Optimized database performance utilizing \textbf{MongoDB Aggregation Pipelines} for advanced watch history analytics, while actively caching frequently read channel profiles in \textbf{Redis}.
\item Secured the platform with \textbf{JWT authentication}, HTTP-only cookies, and \textbf{IP-based API Rate Limiting} powered by Upstash Redis to mitigate brute-force attacks.
\end{itemize}
\vspace{3pt}

% -------------------- PROJECT 2 --------------------
\project {WePay --- Group Expense Tracker} {https://github.com/jatinjarwal/Wepay-backend}
\vspace{2pt}

{\fontsize{9}{10.5}\selectfont \textit{ Node.js | Express.js | MongoDB | Mongoose | JWT | bcrypt.js }}
\vspace{3pt}
\begin{itemize}
\item Developed a backend API using \textbf{Node.js, Express.js, and MongoDB} for managing shared group expenses.
\item Implemented \textbf{JWT authentication} with secure user registration and login using bcrypt.js for password hashing.
\item Built APIs for \textbf{group creation, expense management, category tracking, and automatic expense splitting} between group members.
\item Implemented logic to \textbf{detect duplicate expenses} and calculate how much each member owes or is owed.
\end{itemize}

% =========================================================
% ACHIEVEMENTS & CERTIFICATIONS
% =========================================================

\section{ACHIEVEMENTS \& CERTIFICATIONS}
\begin{itemize}
\item HackerRank Advanced SQL Certificate demonstrating proficiency in SQL.
\item NPTEL Internet of Things — \textbf{Top 5\%}.
\item Solved \textbf{300+ DSA and SQL problems} across LeetCode, GeeksforGeeks, and CodeChef.
\end{itemize}

\end{document}
