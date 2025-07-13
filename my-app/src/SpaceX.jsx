import { useState } from "react";

export default function SpaceX(){
    const[launches, setLaunches]= useState([]);
    const[CurrentPage, setCurrentPage]=useState(0);
    const[loading, setLoading]=useState(false);
    const[loaded, setLoaded]= useState(false);

    const launchesPerPage = 5;
    const loadLaunces =async () => {
        setLoading(true);

        try {
            const res= await fetch('https://api.spacexdata.com/v4/launches')
            const data= await res.json();
            //sort data by date
            const sorted= data.sort((a,b)=>new Date(b.date_utc)-new Date(a.date_utc))//biggest to smallest

            setLaunches(sorted);
            setLoaded(true);
        } catch (error) {
            console.error('failed to launch', error)
            
        }
        setLoading(false)

        
    }

    const totalPages=Math.ceil(launches.length/launchesPerPage);

        const currentLaunches = launches.slice(CurrentPage * launchesPerPage,(CurrentPage+1) * launchesPerPage)

     return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>🚀 SpaceX Launches Timeline</h2>

      {!loaded && (
        <button onClick={loadLaunces} disabled={loading}>
          {loading ? "Loading..." : "Load Launches"}
        </button>
      )}

      {loading && loaded && <p>Loading... 🔄</p>}

      {currentLaunches.length > 0 && (
        <ul>
          {currentLaunches.map((launch) => (
            <li key={launch.id} style={{ marginBottom: "1rem" }}>
              <strong>{launch.name}</strong> <br />
              Date: {new Date(launch.date_utc).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      {loaded && (
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={CurrentPage === 0}
          >
            Previous
          </button>
          <span style={{ margin: "0 1rem" }}>
            Page {CurrentPage +1} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={CurrentPage >= totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

