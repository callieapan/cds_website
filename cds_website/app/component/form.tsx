
async function logData() {
    'use server'
    {/* put use server if you want to log things in the database */}
    
    console.log('hey');
}

export default function Form () {
    return (
        <form action = {logData}> {/* need to add a function here action = {logData} and import that funciton from somewhere*/}
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        Set the invoice status
                    </legend>
                <input
                 name = "address"
                 placeholder = "Address"
                 className = "border boder-grey-400 m-128  w-400 rounded text-xl pl-2" 
                />
                </fieldset>
            </div>
                
        </form>

    )
}