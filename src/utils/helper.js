import { format, isToday, isYesterday } from "date-fns";

export const formatLastMessageTime = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "dd/MM/yyyy");
  }
};
