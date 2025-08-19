export const regex = {
  userName: {
    regex: /^[A-Za-z _-]{8,}$/,
    message:
      "Username must be at least 8 characters long and can only contain letters, spaces, underscores (_), and hyphens (-).",
  },

  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address (example: name@example.com).",
  },
  phone: {
    regex: /^(010|011|012|015)\d{8}$/,
    message:
      "Phone number must start with 010 or 015 and be exactly 11 digits long.",
  },
  password: {
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,16}$/,
    message:
      "Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, one special character, and contain no spaces.",
  },
};
