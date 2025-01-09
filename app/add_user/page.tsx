import AddUserForm from "@/components/ui/adduser_form";

export default function Page() {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
           <AddUserForm />
        </div>
      </main>
    );
  }