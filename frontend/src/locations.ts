export const LOCATIONS = [
  { id: "KING", name: "Dr. Martin Luther King, Jr. Library" },
  { id: "HGH", name: "Hugh Gillis Hall" },
  {
    id: "DMH-IRC",
    name: "Dudley Moorhead Hall / Instructional Resource Center",
  },
  { id: "CRC-ADM", name: "Career Center / Administration" },
  { id: "ENG", name: "Engineering" },
  { id: "IS", name: "Industrial Studies" },
  { id: "CYA", name: "Corporation Yard Offices" },
  { id: "CYB", name: "Corporation Yard Trades Building" },
  { id: "SSC-NPG", name: "Student Services Center / North Parking Garage" },
  { id: "IT", name: "Information Technology" },
  { id: "CL", name: "Clark Hall" },
  { id: "ASH", name: "Associated Students House" },
  { id: "SCI-WSQ", name: "Science Building / Washington Square Hall" },
  { id: "TH", name: "Tower Hall" },
  { id: "CCB", name: "Central Classroom Building" },
  { id: "SU", name: "Diaz Compean Student Union" },
  { id: "BT", name: "Business Tower" },
  { id: "BBC", name: "Boccardo Business Center" },
  { id: "DBH", name: "Dwight Bentel Hall" },
  { id: "MUS", name: "Music Building" },
  { id: "ART", name: "Art Building" },
  { id: "YUH", name: "Yoshihiro Uchida Hall" },
  { id: "SPM", name: "Spartan Memorial" },
  { id: "FOB", name: "Facilities Operations Building" },
  { id: "SPXC-SPXE", name: "Spartan Complex - Center / East" },
  { id: "SWC", name: "Student Wellness Center" },
  { id: "PCUEC", name: "Provident Credit Union Event Center" },
  { id: "HB", name: "Health Building" },
  { id: "CP", name: "Central Plant" },
  { id: "WPG", name: "West Parking Garage" },
  { id: "ISB", name: "Interdisciplinary Sciences Building" },
  { id: "DH", name: "Duncan Hall" },
  { id: "MH", name: "MacQuarrie Hall" },
  { id: "SH", name: "Sweeney Hall" },
  { id: "SPG", name: "South Parking Garage" },
  { id: "SRAC", name: "Spartan Recreation & Aquatic Center" },
  { id: "WSH", name: "Washington Square Hall" },
  { id: "DC-JWH", name: "Dining Commons / Joe West Hall" },
  { id: "CV2", name: "Campus Village 2" },
  { id: "CVC", name: "Campus Village C" },
  { id: "CVB", name: "Campus Village B" },
  { id: "CVA", name: "Campus Village A" },
];

export type Location = { id: string; name: string };
export type LocationWithUniqueId = Location & { uniqueId: string };
