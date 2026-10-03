"""
CollegeFinder Safe Seed Script (Idempotent Development Seeder)
Populates the database with realistic sample colleges, courses, and placement data.
Does NOT modify database schema or delete existing records.
"""

import sys
import os

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from app.models.college import College
from app.models.course import Course
from app.models.placement import Placement

app = create_app()

SEED_DATA = [
    {
        "name": "QIS College of Engineering & Technology",
        "description": "Established in 1998, QIS College of Engineering and Technology is a premier autonomous engineering institute in Ongole offering undergraduate and postgraduate programs in technology and management. (Demo Data)",
        "city": "Ongole",
        "state": "Andhra Pradesh",
        "address": "Vengamukkapalem, Pondur Road, Ongole, Andhra Pradesh - 523272",
        "college_type": "Autonomous",
        "university": "JNTUK",
        "established_year": 1998,
        "website": "https://www.qiscet.edu.in",
        "email": "principal@qiscet.edu.in",
        "phone": "+91 99499 99999",
        "logo": "https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80",
        "rating": 4.3,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 120000},
            {"course_name": "Electronics and Communication Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 110000},
            {"course_name": "Information Technology", "degree": "B.Tech", "duration": "4 Years", "fees": 115000},
            {"course_name": "Master of Business Administration", "degree": "MBA", "duration": "2 Years", "fees": 85000}
        ],
        "placement": {
            "average_package": 5.5,
            "highest_package": 18.0,
            "placement_percentage": 88.5,
            "recruiting_companies": "TCS, Wipro, Infosys, Cognizant, Tech Mahindra, Accenture"
        }
    },
    {
        "name": "Andhra University College of Engineering",
        "description": "Andhra University College of Engineering is a renowned public state college in Visakhapatnam known for excellence in engineering education and research. (Demo Data)",
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "address": "Waltair Junction, Visakhapatnam, Andhra Pradesh - 530003",
        "college_type": "Government",
        "university": "Andhra University",
        "established_year": 1955,
        "website": "https://www.andhrauniversity.edu.in",
        "email": "principal.auce@andhrauniversity.edu.in",
        "phone": "+91 891 2844000",
        "logo": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=300&auto=format&fit=crop&q=80",
        "rating": 4.5,
        "courses": [
            {"course_name": "Chemical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 45000},
            {"course_name": "Mechanical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 45000},
            {"course_name": "Computer Science and Systems Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 50000}
        ],
        "placement": {
            "average_package": 6.8,
            "highest_package": 22.0,
            "placement_percentage": 86.0,
            "recruiting_companies": "ONGC, HPCL, Vizag Steel, TCS, Infosys, L&T"
        }
    },
    {
        "name": "KL Deemed to be University",
        "description": "KLEF is a leading deemed university in Guntur offering state-of-the-art campus infrastructure and global academic collaborations. (Demo Data)",
        "city": "Guntur",
        "state": "Andhra Pradesh",
        "address": "Green Fields, Vaddeswaram, Guntur, Andhra Pradesh - 522502",
        "college_type": "Deemed",
        "university": "KL University",
        "established_year": 1980,
        "website": "https://www.kluniversity.in",
        "email": "admissions@kluniversity.in",
        "phone": "+91 863 2399999",
        "logo": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=300&auto=format&fit=crop&q=80",
        "rating": 4.2,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 240000},
            {"course_name": "Biotechnology", "degree": "B.Tech", "duration": "4 Years", "fees": 180000},
            {"course_name": "Artificial Intelligence & Data Science", "degree": "B.Tech", "duration": "4 Years", "fees": 250000}
        ],
        "placement": {
            "average_package": 7.2,
            "highest_package": 25.0,
            "placement_percentage": 92.0,
            "recruiting_companies": "Amazon, Microsoft, Deloitte, Capgemini, TCS"
        }
    },
    {
        "name": "Indian Institute of Technology Hyderabad",
        "description": "IIT Hyderabad is a premier institute of national importance located in Sangareddy, Telangana, world-renowned for cutting-edge technological innovations. (Demo Data)",
        "city": "Kandi",
        "state": "Telangana",
        "address": "NH-65, Kandi, Sangareddy, Telangana - 502285",
        "college_type": "Government",
        "university": "IIT Hyderabad",
        "established_year": 2008,
        "website": "https://www.iith.ac.in",
        "email": "info@iith.ac.in",
        "phone": "+91 40 23016000",
        "logo": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 220000},
            {"course_name": "Electrical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 220000},
            {"course_name": "Biomedical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000},
            {"course_name": "Artificial Intelligence", "degree": "B.Tech", "duration": "4 Years", "fees": 230000}
        ],
        "placement": {
            "average_package": 20.4,
            "highest_package": 63.7,
            "placement_percentage": 94.0,
            "recruiting_companies": "Google, Apple, Microsoft, Goldman Sachs, TSMC, Qualcomm"
        }
    },
    {
        "name": "Osmania University College of Engineering",
        "description": "University College of Engineering, Osmania University is one of the oldest and most prestigious engineering colleges in Hyderabad. (Demo Data)",
        "city": "Hyderabad",
        "state": "Telangana",
        "address": "Osmania University Campus, Hyderabad, Telangana - 500007",
        "college_type": "Government",
        "university": "Osmania University",
        "established_year": 1929,
        "website": "https://www.uceou.edu",
        "email": "principal@uceou.edu",
        "phone": "+91 40 27098254",
        "logo": "https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80",
        "rating": 4.4,
        "courses": [
            {"course_name": "Civil Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 35000},
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 40000},
            {"course_name": "Electronics and Communication Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 38000}
        ],
        "placement": {
            "average_package": 8.5,
            "highest_package": 24.0,
            "placement_percentage": 87.0,
            "recruiting_companies": "Oracle, MathWorks, BHEL, TCS, Infosys"
        }
    },
    {
        "name": "International Institute of Information Technology Hyderabad",
        "description": "IIIT Hyderabad is an autonomous research university focusing on core areas of Information Technology and Computer Science. (Demo Data)",
        "city": "Hyderabad",
        "state": "Telangana",
        "address": "Gachibowli, Hyderabad, Telangana - 500032",
        "college_type": "Autonomous",
        "university": "IIIT Hyderabad",
        "established_year": 1998,
        "website": "https://www.iiit.ac.in",
        "email": "ugadmissions@iiit.ac.in",
        "phone": "+91 40 66531000",
        "logo": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=300&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 360000},
            {"course_name": "Electronics and Communication Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 360000},
            {"course_name": "Computer Science + Master of Science by Research", "degree": "Dual Degree", "duration": "5 Years", "fees": 360000}
        ],
        "placement": {
            "average_package": 30.2,
            "highest_package": 74.0,
            "placement_percentage": 99.0,
            "recruiting_companies": "Meta, Google, Uber, Amazon, Apple, CodeNation"
        }
    },
    {
        "name": "IIT Madras",
        "description": "Indian Institute of Technology Madras is a public technical university located in Chennai, Tamil Nadu, consistently ranked as the top engineering institute in India. (Demo Data)",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "address": "IIT P.O., Chennai, Tamil Nadu - 600036",
        "college_type": "Government",
        "university": "IIT Madras",
        "established_year": 1959,
        "website": "https://www.iitm.ac.in",
        "email": "registrar@iitm.ac.in",
        "phone": "+91 44 22578100",
        "logo": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=300&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000},
            {"course_name": "Electrical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000},
            {"course_name": "Mechanical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000},
            {"course_name": "Aerospace Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000}
        ],
        "placement": {
            "average_package": 21.5,
            "highest_package": 60.0,
            "placement_percentage": 95.0,
            "recruiting_companies": "Google, Microsoft, Texas Instruments, Intel, Airbus"
        }
    },
    {
        "name": "College of Engineering Guindy, Anna University",
        "description": "CEG Guindy is one of Asia's oldest technical institutions, known for excellent academic tradition and research facilities in Chennai. (Demo Data)",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "address": "12, Sardar Patel Road, Guindy, Chennai, Tamil Nadu - 600025",
        "college_type": "Government",
        "university": "Anna University",
        "established_year": 1794,
        "website": "https://ceg.annauniv.edu",
        "email": "deanceg@annauniv.edu",
        "phone": "+91 44 22358491",
        "logo": "https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80",
        "rating": 4.6,
        "courses": [
            {"course_name": "Information Technology", "degree": "B.Tech", "duration": "4 Years", "fees": 32000},
            {"course_name": "Computer Science and Engineering", "degree": "B.E.", "duration": "4 Years", "fees": 32000},
            {"course_name": "Manufacturing Engineering", "degree": "B.E.", "duration": "4 Years", "fees": 30000}
        ],
        "placement": {
            "average_package": 9.8,
            "highest_package": 36.0,
            "placement_percentage": 91.0,
            "recruiting_companies": "Cisco, Paypal, Caterpillar, Zoho, Ford, Amazon"
        }
    },
    {
        "name": "Vellore Institute of Technology",
        "description": "VIT Vellore is a renowned private deemed university in Tamil Nadu offering engineering, management, and applied science degrees with global acclaim. (Demo Data)",
        "city": "Vellore",
        "state": "Tamil Nadu",
        "address": "Katpadi-Ranipet Road, Vellore, Tamil Nadu - 632014",
        "college_type": "Deemed",
        "university": "VIT University",
        "established_year": 1984,
        "website": "https://vit.ac.in",
        "email": "info@vit.ac.in",
        "phone": "+91 416 2243091",
        "logo": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=300&auto=format&fit=crop&q=80",
        "rating": 4.4,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 198000},
            {"course_name": "Electronics and Communication Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 175000},
            {"course_name": "Mechanical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 175000}
        ],
        "placement": {
            "average_package": 9.2,
            "highest_package": 102.0,
            "placement_percentage": 93.5,
            "recruiting_companies": "Microsoft, Amazon, PayPal, DE Shaw, Wipro, TCS"
        }
    },
    {
        "name": "SRM Institute of Science and Technology",
        "description": "SRM Institute of Science and Technology is a top private institution in Kattankulathur, Tamil Nadu with state-of-the-art labs and high placement records. (Demo Data)",
        "city": "Kanchipuram",
        "state": "Tamil Nadu",
        "address": "SRM Nagar, Kattankulathur, Kanchipuram, Tamil Nadu - 603203",
        "college_type": "Deemed",
        "university": "SRM Institute",
        "established_year": 1985,
        "website": "https://www.srmist.edu.in",
        "email": "admissions@srmist.edu.in",
        "phone": "+91 44 27455510",
        "logo": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80",
        "rating": 4.3,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 260000},
            {"course_name": "Aerospace Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000},
            {"course_name": "Biomedical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 190000}
        ],
        "placement": {
            "average_package": 7.7,
            "highest_package": 44.0,
            "placement_percentage": 90.0,
            "recruiting_companies": "Amazon, Barclays, Cognizant, Siemens, Infosys"
        }
    },
    {
        "name": "Indian Institute of Science",
        "description": "IISc Bengaluru is India's premier public institution for scientific research and higher education in engineering and science. (Demo Data)",
        "city": "Bengaluru",
        "state": "Karnataka",
        "address": "CV Raman Rd, Bengaluru, Karnataka - 560012",
        "college_type": "Government",
        "university": "IISc Bangalore",
        "established_year": 1909,
        "website": "https://iisc.ac.in",
        "email": "registrar@iisc.ac.in",
        "phone": "+91 80 22932001",
        "logo": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=300&auto=format&fit=crop&q=80",
        "rating": 5.0,
        "courses": [
            {"course_name": "Bachelor of Science (Research)", "degree": "B.S.", "duration": "4 Years", "fees": 30000},
            {"course_name": "Computer Science and Engineering", "degree": "M.Tech", "duration": "2 Years", "fees": 25000},
            {"course_name": "Quantum Technology", "degree": "M.Tech", "duration": "2 Years", "fees": 25000}
        ],
        "placement": {
            "average_package": 28.0,
            "highest_package": 86.0,
            "placement_percentage": 98.0,
            "recruiting_companies": "Google Research, IBM Research, Intel, Nvidia, Microsoft Research"
        }
    },
    {
        "name": "RV College of Engineering",
        "description": "RV College of Engineering (RVCE) in Bengaluru is an autonomous engineering college affiliated with VTU, consistently ranked among top private technical colleges. (Demo Data)",
        "city": "Bengaluru",
        "state": "Karnataka",
        "address": "Mysore Road, RV Vidyaniketan Post, Bengaluru, Karnataka - 560059",
        "college_type": "Autonomous",
        "university": "Visvesvaraya Technological University",
        "established_year": 1963,
        "website": "https://rvce.edu.in",
        "email": "principal@rvce.edu.in",
        "phone": "+91 80 67178000",
        "logo": "https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80",
        "rating": 4.6,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.E.", "duration": "4 Years", "fees": 225000},
            {"course_name": "Information Science and Engineering", "degree": "B.E.", "duration": "4 Years", "fees": 210000},
            {"course_name": "Electronics & Communication Engineering", "degree": "B.E.", "duration": "4 Years", "fees": 195000}
        ],
        "placement": {
            "average_package": 11.4,
            "highest_package": 52.0,
            "placement_percentage": 94.0,
            "recruiting_companies": "Cisco, Bosch, Microsoft, Atlassian, Samsung"
        }
    },
    {
        "name": "Manipal Institute of Technology",
        "description": "MIT Manipal is a constituent institution of Manipal Academy of Higher Education, offering industry-integrated technical education. (Demo Data)",
        "city": "Manipal",
        "state": "Karnataka",
        "address": "Udupi - Karkala Rd, Manipal, Karnataka - 576104",
        "college_type": "Deemed",
        "university": "Manipal Academy of Higher Education",
        "established_year": 1957,
        "website": "https://manipal.edu/mit.html",
        "email": "admissions@manipal.edu",
        "phone": "+91 92437 77700",
        "logo": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=300&auto=format&fit=crop&q=80",
        "rating": 4.4,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 335000},
            {"course_name": "Aeronautical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 280000},
            {"course_name": "Data Science & Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 320000}
        ],
        "placement": {
            "average_package": 10.5,
            "highest_package": 54.0,
            "placement_percentage": 92.5,
            "recruiting_companies": "Amazon, Deloitte, Philips, Goldman Sachs, Schneider Electric"
        }
    },
    {
        "name": "IIT Bombay",
        "description": "Indian Institute of Technology Bombay is a premier public technical institution located in Powai, Mumbai, renowned worldwide for academic excellence and entrepreneurship. (Demo Data)",
        "city": "Mumbai",
        "state": "Maharashtra",
        "address": "Main Gate Rd, Powai, Mumbai, Maharashtra - 400076",
        "college_type": "Government",
        "university": "IIT Bombay",
        "established_year": 1958,
        "website": "https://www.iitb.ac.in",
        "email": "info@iitb.ac.in",
        "phone": "+91 22 25722545",
        "logo": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=300&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 220000},
            {"course_name": "Electrical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 220000},
            {"course_name": "Engineering Physics", "degree": "B.Tech", "duration": "4 Years", "fees": 210000},
            {"course_name": "Metallurgical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000}
        ],
        "placement": {
            "average_package": 23.5,
            "highest_package": 120.0,
            "placement_percentage": 96.0,
            "recruiting_companies": "Jane Street, Google, Qualcomm, Boston Consulting Group, Sony Japan"
        }
    },
    {
        "name": "COEP Technological University",
        "description": "College of Engineering Pune is one of India's historic public engineering colleges in Pune, famous for industrial connections and active student clubs. (Demo Data)",
        "city": "Pune",
        "state": "Maharashtra",
        "address": "Wellesley Rd, Shivajinagar, Pune, Maharashtra - 411005",
        "college_type": "Government",
        "university": "COEP Technological University",
        "established_year": 1854,
        "website": "https://www.coep.org.in",
        "email": "director@coep.org.in",
        "phone": "+91 20 25507000",
        "logo": "https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80",
        "rating": 4.6,
        "courses": [
            {"course_name": "Computer Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 95000},
            {"course_name": "Instrumentation and Control Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 90000},
            {"course_name": "Production Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 88000}
        ],
        "placement": {
            "average_package": 9.5,
            "highest_package": 39.0,
            "placement_percentage": 89.0,
            "recruiting_companies": "Mastercard, Tata Motors, Bajaj Auto, Deutsche Bank, Barclays"
        }
    },
    {
        "name": "Veermata Jijabai Technological Institute",
        "description": "VJTI Mumbai is a premier autonomous engineering institute in Matunga, Mumbai, known for producing top engineering leaders. (Demo Data)",
        "city": "Mumbai",
        "state": "Maharashtra",
        "address": "H. R. Mahajani Road, Matunga, Mumbai, Maharashtra - 400019",
        "college_type": "Autonomous",
        "university": "University of Mumbai",
        "established_year": 1887,
        "website": "https://vjti.ac.in",
        "email": "director@vjti.ac.in",
        "phone": "+91 22 24198101",
        "logo": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=300&auto=format&fit=crop&q=80",
        "rating": 4.5,
        "courses": [
            {"course_name": "Computer Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 85000},
            {"course_name": "Information Technology", "degree": "B.Tech", "duration": "4 Years", "fees": 85000},
            {"course_name": "Electrical Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 82000}
        ],
        "placement": {
            "average_package": 10.2,
            "highest_package": 44.0,
            "placement_percentage": 90.5,
            "recruiting_companies": "Morgan Stanley, Texas Instruments, UBS, Reliance, Samsung"
        }
    },
    {
        "name": "IIT Delhi",
        "description": "IIT Delhi is a landmark institute located in Hauz Khas, New Delhi, renowned for technology research and incubation center. (Demo Data)",
        "city": "Delhi",
        "state": "Delhi",
        "address": "Hauz Khas, New Delhi, Delhi - 110016",
        "college_type": "Government",
        "university": "IIT Delhi",
        "established_year": 1961,
        "website": "https://home.iitd.ac.in",
        "email": "info@iitd.ac.in",
        "phone": "+91 11 26597135",
        "logo": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 220000},
            {"course_name": "Biochemical Engineering and Biotechnology", "degree": "B.Tech", "duration": "4 Years", "fees": 210000},
            {"course_name": "Textile Technology", "degree": "B.Tech", "duration": "4 Years", "fees": 200000}
        ],
        "placement": {
            "average_package": 22.8,
            "highest_package": 110.0,
            "placement_percentage": 95.5,
            "recruiting_companies": "Microsoft, McKinsey, Bain & Company, Google, Nvidia"
        }
    },
    {
        "name": "Delhi Technological University",
        "description": "DTU (formerly Delhi College of Engineering) is a premier public university in Rohini, New Delhi with legacy of engineering achievements. (Demo Data)",
        "city": "Delhi",
        "state": "Delhi",
        "address": "Shahbad Daulatpur, Main Bawana Road, New Delhi, Delhi - 110042",
        "college_type": "Government",
        "university": "DTU",
        "established_year": 1941,
        "website": "http://dtu.ac.in",
        "email": "info@dtu.ac.in",
        "phone": "+91 11 27871018",
        "logo": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=300&auto=format&fit=crop&q=80",
        "rating": 4.6,
        "courses": [
            {"course_name": "Software Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 190000},
            {"course_name": "Computer Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 190000},
            {"course_name": "Mathematics and Computing", "degree": "B.Tech", "duration": "4 Years", "fees": 190000}
        ],
        "placement": {
            "average_package": 13.2,
            "highest_package": 51.0,
            "placement_percentage": 93.0,
            "recruiting_companies": "Adobe, Sprinklr, Uber, Amazon, Paytm, Samsung"
        }
    },
    {
        "name": "IIT Kanpur",
        "description": "Indian Institute of Technology Kanpur is a public research institute in Uttar Pradesh known for computer science research and flight laboratory. (Demo Data)",
        "city": "Kanpur",
        "state": "Uttar Pradesh",
        "address": "Kalyanpur, Kanpur, Uttar Pradesh - 208016",
        "college_type": "Government",
        "university": "IIT Kanpur",
        "established_year": 1959,
        "website": "https://www.iitk.ac.in",
        "email": "registrar@iitk.ac.in",
        "phone": "+91 512 2590151",
        "logo": "https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 215000},
            {"course_name": "Biological Sciences and Bioengineering", "degree": "B.Tech", "duration": "4 Years", "fees": 215000},
            {"course_name": "Earth Sciences", "degree": "BS", "duration": "4 Years", "fees": 200000}
        ],
        "placement": {
            "average_package": 21.0,
            "highest_package": 105.0,
            "placement_percentage": 94.0,
            "recruiting_companies": "Google, Databricks, Rubrik, Microsoft, Intel"
        }
    },
    {
        "name": "Amity University Noida",
        "description": "Amity University is a leading private research university in Noida, Uttar Pradesh, featuring modern sports complex and global campuses. (Demo Data)",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "address": "Sector-125, Noida, Uttar Pradesh - 201313",
        "college_type": "Private",
        "university": "Amity University",
        "established_year": 2005,
        "website": "https://www.amity.edu",
        "email": "admissions@amity.edu",
        "phone": "+91 120 2445252",
        "logo": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=300&auto=format&fit=crop&q=80",
        "rating": 4.1,
        "courses": [
            {"course_name": "Computer Science & Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 310000},
            {"course_name": "Nanotechnology", "degree": "B.Tech", "duration": "4 Years", "fees": 260000},
            {"course_name": "Fashion Technology", "degree": "B.Des", "duration": "4 Years", "fees": 220000}
        ],
        "placement": {
            "average_package": 6.2,
            "highest_package": 30.0,
            "placement_percentage": 85.0,
            "recruiting_companies": "HCL, Accenture, EY, KPMG, Tech Mahindra"
        }
    },
    {
        "name": "IIT Kharagpur",
        "description": "IIT Kharagpur is the first Indian Institute of Technology established in West Bengal, boasting the largest campus area in India. (Demo Data)",
        "city": "Kharagpur",
        "state": "West Bengal",
        "address": "Kharagpur, West Bengal - 721302",
        "college_type": "Government",
        "university": "IIT Kharagpur",
        "established_year": 1951,
        "website": "http://www.iitkgp.ac.in",
        "email": "reg@hijli.iitkgp.ac.in",
        "phone": "+91 3222 255221",
        "logo": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=300&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "courses": [
            {"course_name": "Computer Science and Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000},
            {"course_name": "Ocean Engineering and Naval Architecture", "degree": "B.Tech", "duration": "4 Years", "fees": 200000},
            {"course_name": "Industrial and Systems Engineering", "degree": "B.Tech", "duration": "4 Years", "fees": 210000}
        ],
        "placement": {
            "average_package": 19.8,
            "highest_package": 95.0,
            "placement_percentage": 93.0,
            "recruiting_companies": "Apple, ExxonMobil, Schlumberger, Honeywell, ITC"
        }
    },
    {
        "name": "BITS Pilani",
        "description": "Birla Institute of Technology and Science Pilani is an iconic deemed university in Rajasthan renowned for merit-based admission and Practice School internship program. (Demo Data)",
        "city": "Pilani",
        "state": "Rajasthan",
        "address": "Vidya Vihar Campus, Pilani, Rajasthan - 333031",
        "college_type": "Deemed",
        "university": "BITS Pilani",
        "established_year": 1964,
        "website": "https://www.bits-pilani.ac.in",
        "email": "admissions@pilani.bits-pilani.ac.in",
        "phone": "+91 1596 245073",
        "logo": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "courses": [
            {"course_name": "Computer Science", "degree": "B.E.", "duration": "4 Years", "fees": 490000},
            {"course_name": "Electrical and Electronics Engineering", "degree": "B.E.", "duration": "4 Years", "fees": 490000},
            {"course_name": "Chemical Engineering", "degree": "B.E.", "duration": "4 Years", "fees": 470000}
        ],
        "placement": {
            "average_package": 18.5,
            "highest_package": 60.0,
            "placement_percentage": 96.5,
            "recruiting_companies": "Google, Uber, Texas Instruments, Nutanix, DE Shaw"
        }
    }
]

def seed_database():
    print("Starting CollegeFinder seed...")
    
    colleges_created = 0
    colleges_skipped = 0
    courses_created = 0
    placements_created = 0

    with app.app_context():
        for c_data in SEED_DATA:
            # Idempotency check: unique combination name + city + state
            existing = College.query.filter_by(
                name=c_data["name"],
                city=c_data["city"],
                state=c_data["state"]
            ).first()

            if existing:
                colleges_skipped += 1
                continue

            # Create College record
            college = College(
                name=c_data["name"],
                description=c_data["description"],
                city=c_data["city"],
                state=c_data["state"],
                address=c_data["address"],
                college_type=c_data["college_type"],
                university=c_data["university"],
                established_year=c_data["established_year"],
                website=c_data["website"],
                email=c_data["email"],
                phone=c_data["phone"],
                logo=c_data["logo"],
                rating=c_data["rating"]
            )
            db.session.add(college)
            db.session.flush()  # Obtain generated college ID
            colleges_created += 1

            # Create Courses
            if "courses" in c_data:
                for cr_data in c_data["courses"]:
                    course = Course(
                        college_id=college.id,
                        course_name=cr_data["course_name"],
                        degree=cr_data["degree"],
                        duration=cr_data["duration"],
                        fees=cr_data["fees"]
                    )
                    db.session.add(course)
                    courses_created += 1

            # Create Placement
            if "placement" in c_data:
                pl_data = c_data["placement"]
                placement = Placement(
                    college_id=college.id,
                    average_package=pl_data["average_package"],
                    highest_package=pl_data["highest_package"],
                    placement_percentage=pl_data["placement_percentage"],
                    recruiting_companies=pl_data["recruiting_companies"]
                )
                db.session.add(placement)
                placements_created += 1

        db.session.commit()

    print(f"Created: {colleges_created} colleges")
    print(f"Skipped existing: {colleges_skipped} colleges")
    print(f"Created courses: {courses_created} courses")
    print(f"Created placements: {placements_created} placements")
    print("Seed completed successfully.")

if __name__ == "__main__":
    seed_database()
