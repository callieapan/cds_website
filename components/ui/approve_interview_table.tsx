'use client';
import { formatQuestionAnswer } from '@/lib/utils';
import { InterviewDataAll } from '@/app/lib/definitions';
import { useState } from 'react'; // Import useState for managing state
import { approveInterview } from '@/app/lib/actions';
import { useRouter } from 'next/navigation'; // Add this import

const formatDateToLocal = (date: Date, locale: string = 'en-US') => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export default function ApproveInterviewTable({ 
    interviews}: {interviews:InterviewDataAll[]
}) {
  const router = useRouter();
  const [approver, setApprover] = useState<string>(''); // Selected approver
  const [selectedIds, setSelectedIds]  = useState<Set<string>>(new Set()); // Track selected rows' ids
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

  // Handle checkbox selection
  const handleCheckboxChange = (entry_id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(entry_id)) {
      newSelectedIds.delete(entry_id);
    } else {
      newSelectedIds.add(entry_id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedIds.size === 0 || !approver) {
      alert('Please select at least one row and an approver.');
      return;
    }

    try {
      setIsSubmitting(true); // Disable form while submitting
      console.log('selectedIds', selectedIds);
      console.log('selected approver', approver);
      const result = await approveInterview(selectedIds, approver);  

      if (result.success) {
        alert('interviews approved successfully!');
        setSelectedIds(new Set()); // Clear selected rows
        setApprover(''); // Reset approver
        router.refresh(); // This will trigger a refresh of the server components
      } else {
        throw new Error('Failed to approve rows');
      }
    } catch (error) {
      console.error('Error approving rows:', error);
      alert('Failed to approve rows. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable form
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <form onSubmit={handleSubmit}>
            <table className="min-w-full text-gray-900 table-fixed">
              <thead className="text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-bold sm:pl-6 w-32">Date</th>
                  <th scope="col" className="px-3 py-5 font-bold break-words w-32">Company</th>
                  <th scope="col" className="px-3 py-5 font-bold w-32">Position</th>
                  <th scope="col" className="px-3 py-5 font-bold w-32">Round</th>
                  <th scope="col" className="px-3 py-5 font-bold min-w-[300px]">Interview Experience</th>
                  <th scope="col" className="px-3 py-5 font-bold w-32">CDS Alumn</th>
                  <th scope="col" className="px-3 py-5 font-bold w-32">CDS Alum Contact Info</th>
                  <th scope="col" className="px-3 py-5 font-bold w-32">CDS Alum Email</th>
                  <th scope="col" className="px-3 py-5 font-bold w-32">Approved</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((row) => (
                  <tr key={row.entry_id} className="border-b py-3 text-sm last:border-none">
                    <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(row.date)}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.company}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.position}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.round}</td>
                    <td className="whitespace-normal px-3 py-3 break-words">{formatQuestionAnswer(row.questionanswer)}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.username}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.contactinfo}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.email}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.entry_id)}
                        onChange={() => handleCheckboxChange(row.entry_id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Dropdown and Submit Button */}
            <div className="mt-4 flex items-center gap-4">
              <select
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className="p-2 border rounded"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Approver</option>
                <option value="Calliea Pan">Calliea Pan</option>
                <option value="Sarath Kareti">Sarath Kareti</option>
                <option value="Yash Deshpande">Yash Deshpande</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Approving...' : 'Approve Selected Interviews'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}