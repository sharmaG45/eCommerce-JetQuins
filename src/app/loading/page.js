const LoadingSpinner = () => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f8f9fa",
        }}
    >
        <div
            style={{
                width: "50px",
                height: "50px",
                border: "5px solid #ddd",
                borderTop: "5px solid #007bff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
            }}
        />
        <style>
            {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
    </div>
);
export default LoadingSpinner;  