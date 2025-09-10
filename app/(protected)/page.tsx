export default function Home() {
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <h1 className="font-bold text-2xl mb-6">UNQ Under Consultants</h1>
        <div className="max-w-[50rem] text-lg">
          <p className="mb-4">
            Welcome to an app to keep track of UNQ:s under consultants. In this
            app it is possible to add clients, consultants, partners and new
            consult assigments where all the information comes together.
          </p>
          <p>
            This app will show an overview and help keep track of the monthly
            assigments for all the under consultants (see under Assigments).
          </p>
        </div>
      </div>
    </>
  );
}
