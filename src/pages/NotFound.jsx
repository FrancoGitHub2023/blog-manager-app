const NotFound = () => {
    return (
        <div className="container">
            <div className="card">
                <div className="card-content" style={{ textAlign: 'center' }}>
                    <h1>404 - Pagina Non Trovata</h1>
                    <p>La pagina che stai cercando non esiste.</p>
                    <a href="/">Torna alla Home</a>
                </div>
            </div>
        </div>
    );
};


export default NotFound;
