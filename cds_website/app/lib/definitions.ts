export type InterviewData = {
    entry_id: string; // Assuming entry_id is a string, adjust according to your actual data schema
    date: string; // Date as string, could be converted to Date type if necessary within the component
    company: string;
    position: string;
    round: string;
    questionanswer: string; // The field names should match the keys in your actual interview objects
    username: string;
    contactinfo: string;
};

// export type NumItem = {
//     total_items: number;
// }

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
  };

  export type EmailPassword = {
    email: string;
    password: string;
  };