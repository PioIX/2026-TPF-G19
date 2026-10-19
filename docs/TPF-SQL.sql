CREATE TABLE IF NOT EXISTS Usuarios (
		id INT AUTO_INCREMENT,
		nombre VARCHAR(255) NOT NULL UNIQUE,
		correo VARCHAR(255) NOT NULL UNIQUE,
		contrasenia VARCHAR(255) NOT NULL,
		rol VARCHAR(255) NOT NULL DEFAULT 'jugador',
		foto_url VARCHAR(255),
		fecha_creacion DATETIME,
		PRIMARY KEY (id)
	);

	CREATE TABLE IF NOT EXISTS Selecciones (
		id INT AUTO_INCREMENT,
		nombre VARCHAR(255) NOT NULL UNIQUE,
		codigo VARCHAR(255) NOT NULL UNIQUE,
		escudo_url VARCHAR(255),
		PRIMARY KEY (id)
	);

	CREATE TABLE IF NOT EXISTS Mundiales (
		id INT AUTO_INCREMENT,
		anio INT,
		pais_sede VARCHAR(255),
		PRIMARY KEY (id)
	);

	CREATE TABLE IF NOT EXISTS Jugadores (
		id INT AUTO_INCREMENT,
		nombre VARCHAR(255) NOT NULL UNIQUE,
		PRIMARY KEY (id)
	);

	CREATE TABLE IF NOT EXISTS Plantillas (
		id INT AUTO_INCREMENT,
		seleccion_id INT,
		mundial_id INT,
		PRIMARY KEY (id),
		FOREIGN KEY (seleccion_id) REFERENCES Selecciones(id),
		FOREIGN KEY (mundial_id) REFERENCES Mundiales(id)
	);

	CREATE TABLE IF NOT EXISTS PlantillaJugadores (
		id INT AUTO_INCREMENT,
		plantilla_id INT,
		jugador_id INT,
		posicion VARCHAR(255),
		valoracion INT,
		PRIMARY KEY (id),
		FOREIGN KEY (plantilla_id) REFERENCES Plantillas(id),
		FOREIGN KEY (jugador_id) REFERENCES Jugadores(id)
	);

	CREATE TABLE IF NOT EXISTS Partidas (
		id INT AUTO_INCREMENT,
		usuario_id INT,
		estado VARCHAR(255) DEFAULT 'en_curso',
		plantilla_sorteada_id INT,
		rival_plantilla_id INT,
		fase VARCHAR(255),
		goles_favor INT DEFAULT 0,
		goles_contra INT DEFAULT 0,
		puntaje INT DEFAULT 0,
		fecha_creacion DATETIME,
		fecha_fin DATETIME,
		PRIMARY KEY (id),
		FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
		FOREIGN KEY (plantilla_sorteada_id) REFERENCES Plantillas(id),
		FOREIGN KEY (rival_plantilla_id) REFERENCES Plantillas(id)
	);

	CREATE TABLE IF NOT EXISTS PartidaJugadores (
		id INT AUTO_INCREMENT,
		partida_id INT,
		plantilla_jugador_id INT,
		numero INT,
		posicion VARCHAR(255),
		goles INT DEFAULT 0,
		PRIMARY KEY (id),
		FOREIGN KEY (partida_id) REFERENCES Partidas(id),
		FOREIGN KEY (plantilla_jugador_id) REFERENCES PlantillaJugadores(id)
	);

	INSERT INTO Usuarios (nombre, correo, contrasenia, rol, foto_url, fecha_creacion) VALUES
	('agustinp', 'amedina@pioix.edu.ar', 'eloso', 'admin', 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Estadio_mas_monumental.jpg', '2026-10-08 07:00:00'),
	('agustinf', 'afilipelli@pioix.edu.ar', 'velez', 'admin', 'https://velezsarsfield.com.ar/img/contenido/club/cd/estadio-05.jpg', '2026-10-08 07:00:00'),
	('facundog', 'fngarcia@pioix.edu.ar', 'tanque', 'admin', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjPZZw_0s-VWNWsKm2C-Ju_iyVDbBhzqitv8fQlhA9oYdK-NXtWq681O7D&s=10', '2026-10-08 07:00:00'),
	('bautistam', 'bmarc@pioix.edu.ar', 'marcus', 'admin', 'https://cdn.conmebol.com/wp-content/uploads/2014/08/bombonera-750x485.jpg', '2026-10-08 07:00:00');

	INSERT INTO Selecciones (nombre, codigo, escudo_url) VALUES
	('Argentina', 'ARG', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxnx7NOQWMFVlUihubI6vpoHj4ympMSwiGRjRViPf4sw&s=10'),
	('Brasil', 'BRA', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Brazilian_Football_Confederation_logo.svg/500px-Brazilian_Football_Confederation_logo.svg.png?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=thumbnail'),
	('Alemania', 'GER', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXAl9t-rK7sd3KN8494U8WGFBU-cD3eMm9poJBWBQOpg&s=10'),
	('Francia', 'FRA', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4rs2OOc8MxT8ixU3zdLFSEeV0tVmGl7d43w0APOIoBA&s=10'),
	('Italia', 'ITA', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-3LnFDC0Hsu6atha9OenE7bOK1jS5JR9v5jIXfF1XEw&s=10'),
	('Uruguay', 'URU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9zQprX8D_L39O5zNQFLRHftZs_Bckhxdh_IfBw5n8wg&s=10'),
	('Países Bajos', 'HOL', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIYTYbPzvjnlLc8Yk1lb1Z2ndeldVNd-rdvl4h8Bi4Ng&s=10'),
	('España', 'ESP', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVXYHnG0XmjlckW1GrObsPnSXHg7tZP55qqlQORPwq4w&s=10'),
	('Inglaterra', 'ING', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWLc9wq2qAy5h7TDQ43Tx48BKf-6uRFjsYDXjc7SdJGQ&s=10'),
	('Portugal', 'POR', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0SnaR73lFhnk3IHR_-xzCci1AJEgYJ9ENVmru9Jy9w&s=10'),
	('Hungría', 'HUN', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgmgp-IN5pcnvRzLUsfrnWANFbX801NFgv-TUkLOorzw&s=10'),
	('México', 'MEX', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQClckO93e--dWFr3h7cDaCbmPD7jlTZJJDJuaAWuL5WQ&s=10'),
	('Polonia', 'POL', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbeNSdpBxZIQBJ6Jf-EdfRryaNtJYOevBFUYDdRgDPPg&s=10'),
	('República Checa', 'CHE', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAI8jQLIe5DjVgWMt6hcAgxoStQrEhqJyU6AFY51jyhQ&s=10'),
	('Colombia', 'COL', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7mq__JFh1Tk3pniyNOOJOMlchxmzUYfGvIW1nvi7M5w&s=10'),
	('Corea del Sur', 'COR', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi21S-OI5iQlOtDGCzl-lg5LoLfwAehXjn7Hgbu-L1eg&s=10'),
	('Costa de Marfil', 'COS', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh0Npvw53ZsPZi1XKtAABht2tZFQX-6s6z_KYKKN7OMQ&s=10'),
	('Bulgaria', 'BUL', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS_P0QtDkQNSWXJiA6p2HeSPfNSBKUwWQ6F4TirXa6dQ&s=10'),
	('Gales', 'GAL', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKPlo7B7fpbG0RMP69Jyx-0eUDFQMCyBQ1sKCPUb-GnQ&s=10'),
	('Chile', 'CHI', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1_q50Ed9EDNsNlDJkvYwojPjIEh6NwAON5UGK35qqLA&s=10'),
	('Dinamarca', 'DIN', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1hjF4xZTxzkGtdDIIPLCKxSf2JAYCo5l4w2yQ_qQPog&s=10'),
	('Noruega', 'NOR', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB2IIdcQyT3Eva0U6TVmW79tuA4xPC4qbhGV0jPnAPHQ&s'),
	('Japón', 'JAP', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_iQv08gwnSt2XXidMYkJN2ewjHKwRRqhIDUS--6OMUg&s');

	INSERT INTO Mundiales (anio, pais_sede) VALUES
	(2026, 'EEUU'),
	(2022, 'Catar'),
	(2018, 'Rusia'),
	(2014, 'Brasil'),
	(2010, 'Sudáfrica'),
	(2006, 'Alemania'),
	(2002, 'Corea'),
	(1998, 'Francia'),
	(1994, 'EEUU'),
	(1990, 'Italia'),
	(1986, 'México'),
	(1982, 'España'),
	(1978, 'Argentina'),
	(1974, 'Alemania'),
	(1970, 'México'),
	(1966, 'Inglaterra'),
	(1962, 'Chile'),
	(1958, 'Suecia'),
	(1954, 'Suiza'),
	(1950, 'Brasil'),
	(1938, 'Francia'),
	(1934, 'Italia'),
	(1930, 'Uruguay');

INSERT INTO Jugadores (nombre) VALUES
-- Argentina 2026
('Emiliano Martínez'),
('Gonzalo Montiel'),
('Cristian Romero'),
('Lisandro Martínez'),
('Nicolás Tagliafico'),
('Rodrigo De Paul'),
('Enzo Fernández'),
('Alexis Mac Allister'),
('Nicolás González'),
('Lionel Messi'),
('Julián Álvarez'),
-- Argentina 2022
('Nahuel Molina'),
('Nicolás Otamendi'),
('Ángel Di María'),
-- Argentina 2018
('Franco Armani'),
('Gabriel Mercado'),
('Marcos Rojo'),
('Javier Mascherano'),
('Éver Banega'),
('Enzo Pérez'),
('Cristian Pavón'),
-- Argentina 2014
('Sergio Romero'),
('Pablo Zabaleta'),
('Ezequiel Garay'),
('Martín Demichelis'),
('Lucas Biglia'),
('Ezequiel Lavezzi'),
('Gonzalo Higuaín'),
-- Argentina 2006
('Roberto Abbondanzieri'),
('Fabricio Coloccini'),
('Roberto Ayala'),
('Gabriel Heinze'),
('Juan Pablo Sorín'),
('Esteban Cambiasso'),
('Maxi Rodríguez'),
('Juan Román Riquelme'),
('Hernán Crespo'),
('Carlos Tevez'),
-- Argentina 1994
('Luis Islas'),
('Néstor Sensini'),
('Oscar Ruggeri'),
('José Chamot'),
('Sergio Vázquez'),
('Fernando Redondo'),
('Diego Simeone'),
('Claudio Caniggia'),
('Gabriel Batistuta'),
('Abel Balbo'),
-- Argentina 1990
('Sergio Goycochea'),
('Juan Simón'),
('José Serrizuela'),
('Julio Olarticoechea'),
('Ricardo Giusti'),
('Jorge Basualdo'),
('Jorge Burruchaga'),
('Pedro Troglio'),
-- Argentina 1986
('Nery Pumpido'),
('José Cuciuffo'),
('José Luis Brown'),
('Sergio Batista'),
('Diego Maradona'),
('Héctor Enrique'),
('Jorge Valdano'),
-- Argentina 1978
('Ubaldo Fillol'),
('Jorge Olguín'),
('Daniel Passarella'),
('Luis Galván'),
('Alberto Tarantini'),
('Américo Gallego'),
('Osvaldo Ardiles'),
('Daniel Bertoni'),
('Leopoldo Luque'),
('Mario Kempes'),
('Oscar Ortiz'),
-- Argentina 1966
('Antonio Roma'),
('Roberto Ferreiro'),
('Roberto Perfumo'),
('Rafael Albrecht'),
('Silvio Marzolini'),
('Antonio Rattín'),
('Jorge Solari'),
('Alberto González'),
('Ermindo Onega'),
('Oscar Más'),
('Luis Artime'),
-- Brasil 2026
('Alisson'),
('Danilo'),
('Marquinhos'),
('Gabriel Magalhães'),
('Douglas Santos'),
('Casemiro'),
('Bruno Guimarães'),
('Lucas Paquetá'),
('Rayan'),
('Matheus Cunha'),
('Vinícius Júnior'),
-- Brasil 2022
('Thiago Silva'),
('Alex Sandro'),
('Raphinha'),
('Neymar'),
('Richarlison'),
-- Brasil 2018
('Fagner'),
('Miranda'),
('Marcelo'),
('Fernandinho'),
('Paulinho'),
('Willian'),
('Philippe Coutinho'),
('Gabriel Jesus'),
-- Brasil 2014
('Júlio César'),
('Dani Alves'),
('David Luiz'),
('Luiz Gustavo'),
('Oscar'),
('Hulk'),
('Fred'),
-- Brasil 2006
('Dida'),
('Cafu'),
('Lúcio'),
('Juan'),
('Roberto Carlos'),
('Gilberto Silva'),
('Zé Roberto'),
('Kaká'),
('Ronaldinho'),
('Ronaldo'),
('Adriano'),
-- Brasil 2002
('Marcos'),
('Edmílson'),
('Roque Júnior'),
('Kléberson'),
('Rivaldo'),
-- Brasil 1998
('Taffarel'),
('Aldair'),
('Júnior Baiano'),
('Dunga'),
('César Sampaio'),
('Leonardo'),
('Bebeto'),
-- Brasil 1994
('Jorginho'),
('Márcio Santos'),
('Branco'),
('Mauro Silva'),
('Mazinho'),
('Zinho'),
('Romário'),
-- Brasil 1990
('Ricardo Gomes'),
('Mauro Galvão'),
('Mozer'),
('Alemão'),
('Valdo'),
('Muller'),
('Careca'),
-- Brasil 1982
('Waldir Peres'),
('Leandro'),
('Luizinho'),
('Júnior'),
('Cerezo'),
('Falcão'),
('Sócrates'),
('Zico'),
('Éder'),
('Óscar'),
('Serginho Chulapa'),
-- Brasil 1970
('Félix'),
('Carlos Alberto Torres'),
('Brito'),
('Piazza'),
('Everaldo'),
('Clodoaldo'),
('Gérson'),
('Jairzinho'),
('Tostão'),
('Pelé'),
('Rivellino'),
-- Brasil 1962
('Gilmar'),
('Djalma Santos'),
('Mauro'),
('Zózimo'),
('Nilton Santos'),
('Zito'),
('Didi'),
('Garrincha'),
('Vavá'),
('Amarildo'),
('Zagallo'),
-- Brasil 1958
('Bellini'),
('Orlando'),
-- Alemania 2022
('Manuel Neuer'),
('Niklas Süle'),
('Antonio Rüdiger'),
('Nico Schlotterbeck'),
('David Raum'),
('Joshua Kimmich'),
('Ilkay Gündogan'),
('Serge Gnabry'),
('Jamal Musiala'),
('Thomas Müller'),
('Kai Havertz'),
-- Alemania 2018
('Jérôme Boateng'),
('Mats Hummels'),
('Jonas Hector'),
('Sami Khedira'),
('Toni Kroos'),
('Mesut Özil'),
('Marco Reus'),
('Julian Draxler'),
('Timo Werner'),
-- Alemania 2014
('Philipp Lahm'),
('Benedikt Höwedes'),
('Bastian Schweinsteiger'),
('Christoph Kramer'),
('Miroslav Klose'),
-- Alemania 2006
('Jens Lehmann'),
('Arne Friedrich'),
('Per Mertesacker'),
('Christoph Metzelder'),
('Bernd Schneider'),
('Torsten Frings'),
('Michael Ballack'),
('Lukas Podolski'),
-- Alemania 2002
('Oliver Kahn'),
('Thomas Linke'),
('Carsten Ramelow'),
('Dietmar Hamann'),
('Jens Jeremies'),
('Oliver Neuville'),
-- Alemania 1990
('Bodo Illgner'),
('Klaus Augenthaler'),
('Guido Buchwald'),
('Jürgen Kohler'),
('Thomas Berthold'),
('Andreas Brehme'),
('Lothar Matthäus'),
('Thomas Hässler'),
('Pierre Littbarski'),
('Jürgen Klinsmann'),
('Rudi Völler'),
-- Alemania 1986
('Harald Schumacher'),
('Ditmar Jakobs'),
('Karlheinz Förster'),
('Hans-Peter Briegel'),
('Felix Magath'),
('Norbert Eder'),
('Karl-Heinz Rummenigge'),
('Klaus Allofs'),
-- Alemania 1974
('Sepp Maier'),
('Berti Vogts'),
('Franz Beckenbauer'),
('Hans-Georg Schwarzenbeck'),
('Paul Breitner'),
('Rainer Bonhof'),
('Wolfgang Overath'),
('Uli Hoeneß'),
('Jürgen Grabowski'),
('Gerd Müller'),
('Bernd Hölzenbein'),
-- Francia 2026
('Mike Maignan'),
('Jules Koundé'),
('Dayot Upamecano'),
('William Saliba'),
('Lucas Digne'),
('Aurélien Tchouaméni'),
('Adrien Rabiot'),
('Ousmane Dembélé'),
('Michael Olise'),
('Bradley Barcola'),
('Kylian Mbappé'),
-- Francia 2022
('Hugo Lloris'),
('Raphaël Varane'),
('Theo Hernández'),
('Antoine Griezmann'),
('Olivier Giroud'),
-- Francia 2018
('Benjamin Pavard'),
('Samuel Umtiti'),
('Lucas Hernandez'),
('N''Golo Kanté'),
('Paul Pogba'),
('Blaise Matuidi'),
-- Francia 2014
('Mathieu Debuchy'),
('Mamadou Sakho'),
('Patrice Evra'),
('Yohan Cabaye'),
('Mathieu Valbuena'),
('Karim Benzema'),
-- Francia 2006
('Fabien Barthez'),
('Willy Sagnol'),
('Lilian Thuram'),
('William Gallas'),
('Éric Abidal'),
('Patrick Vieira'),
('Claude Makélélé'),
('Franck Ribéry'),
('Zinedine Zidane'),
('Florent Malouda'),
('Thierry Henry'),
-- Francia 1998
('Marcel Desailly'),
('Frank Leboeuf'),
('Bixente Lizarazu'),
('Christian Karembeu'),
('Didier Deschamps'),
('Emmanuel Petit'),
('Youri Djorkaeff'),
('Stéphane Guivarc''h'),
-- Francia 1938
('Laurent Di Lorto'),
('Étienne Mattler'),
('Raoul Diagne'),
('Jules Vandooren'),
('Lucien Jasseron'),
('Edmond Delfour'),
('Émile Veinante'),
('Oscar Heisserer'),
('Jean Nicolas'),
('Fred Aston'),
('Ignace Kowalczyk'),
-- Italia 2014
('Gianluigi Buffon'),
('Mattia De Sciglio'),
('Andrea Barzagli'),
('Giorgio Chiellini'),
('Matteo Darmian'),
('Andrea Pirlo'),
('Marco Verratti'),
('Claudio Marchisio'),
('Antonio Candreva'),
('Mario Balotelli'),
('Ciro Immobile'),
-- Italia 2006
('Gianluca Zambrotta'),
('Fabio Cannavaro'),
('Marco Materazzi'),
('Fabio Grosso'),
('Gennaro Gattuso'),
('Mauro Camoranesi'),
('Simone Perrotta'),
('Francesco Totti'),
('Luca Toni'),
-- Italia 1994
('Gianluca Pagliuca'),
('Roberto Mussi'),
('Franco Baresi'),
('Paolo Maldini'),
('Antonio Benarrivo'),
('Nicola Berti'),
('Dino Baggio'),
('Demetrio Albertini'),
('Roberto Donadoni'),
('Daniele Massaro'),
('Roberto Baggio'),
-- Italia 1982
('Dino Zoff'),
('Claudio Gentile'),
('Fulvio Collovati'),
('Gaetano Scirea'),
('Antonio Cabrini'),
('Gabriele Oriali'),
('Marco Tardelli'),
('Giancarlo Antognoni'),
('Bruno Conti'),
('Paolo Rossi'),
('Francesco Graziani'),
-- Italia 1974
('Luciano Spinosi'),
('Giacinto Facchetti'),
('Tarcisio Burgnich'),
('Romeo Benetti'),
('Fabio Capello'),
('Gianni Rivera'),
('Sandro Mazzola'),
('Franco Causio'),
('Pietro Anastasi'),
('Giorgio Chinaglia'),
-- Italia 1970
('Enrico Albertosi'),
('Pierluigi Cera'),
('Roberto Rosato'),
('Mario Bertini'),
('Giancarlo De Sisti'),
('Angelo Domenghini'),
('Roberto Boninsegna'),
('Luigi Riva'),
-- Uruguay 2026
('Fernando Muslera'),
('Guillermo Varela'),
('Sebastián Cáceres'),
('Mathías Olivera'),
('Matías Viña'),
('Manuel Ugarte'),
('Rodrigo Bentancur'),
('Federico Valverde'),
('Maxi Araújo'),
('Federico Viñas'),
('Darwin Núñez'),
-- Uruguay 2022
('Sergio Rochet'),
('José María Giménez'),
('Diego Godín'),
('Giorgian De Arrascaeta'),
('Facundo Pellistri'),
('Edinson Cavani'),
('Luis Suárez'),
-- Uruguay 2018
('Diego Laxalt'),
('Nahitan Nández'),
('Lucas Torreira'),
('Matías Vecino'),
-- Uruguay 2010
('Maxi Pereira'),
('Diego Lugano'),
('Jorge Fucile'),
('Egidio Arévalo'),
('Diego Pérez'),
('Álvaro Pereira'),
('Diego Forlán'),
-- Uruguay 1950
('Roque Máspoli'),
('Matías González'),
('Eusebio Tejera'),
('Schubert Gambetta'),
('Víctor Rodríguez Andrade'),
('Obdulio Varela'),
('Alcides Ghiggia'),
('Julio Pérez'),
('Óscar Míguez'),
('Juan Alberto Schiaffino'),
('Rubén Morán'),
-- Países Bajos 2026
('Bart Verbruggen'),
('Denzel Dumfries'),
('Jan Paul van Hecke'),
('Virgil van Dijk'),
('Micky van de Ven'),
('Frenkie de Jong'),
('Ryan Gravenberch'),
('Tijjani Reijnders'),
('Cody Gakpo'),
('Donyell Malen'),
('Brian Brobbey'),
-- Países Bajos 2022
('Andries Noppert'),
('Jurriën Timber'),
('Nathan Aké'),
('Davy Klaassen'),
('Daley Blind'),
('Steven Bergwijn'),
('Memphis Depay'),
-- Países Bajos 2014
('Jasper Cillessen'),
('Ron Vlaar'),
('Stefan de Vrij'),
('Bruno Martins Indi'),
('Dirk Kuyt'),
('Nigel de Jong'),
('Wesley Sneijder'),
('Georginio Wijnaldum'),
('Robin van Persie'),
('Arjen Robben'),
-- Países Bajos 2010
('Maarten Stekelenburg'),
('Gregory van der Wiel'),
('John Heitinga'),
('Joris Mathijsen'),
('Giovanni van Bronckhorst'),
('Mark van Bommel'),
-- Países Bajos 1990
('Hans van Breukelen'),
('Berry van Aerle'),
('Frank Rijkaard'),
('Ronald Koeman'),
('Adri van Tiggelen'),
('Jan Wouters'),
('Erwin Koeman'),
('Ruud Gullit'),
('Gerald Vanenburg'),
('Marco van Basten'),
('Wim Kieft'),
-- Países Bajos 1974
('Jan Jongbloed'),
('Wim Suurbier'),
('Wim Rijsbergen'),
('Arie Haan'),
('Ruud Krol'),
('Wim Jansen'),
('Johan Neeskens'),
('Willem van Hanegem'),
('Johnny Rep'),
('Johan Cruyff'),
('Rob Rensenbrink'),
-- España 2026
('Unai Simón'),
('Pedro Porro'),
('Pau Cubarsí'),
('Aymeric Laporte'),
('Marc Cucurella'),
('Rodri'),
('Fabián Ruiz'),
('Lamine Yamal'),
('Dani Olmo'),
('Álex Baena'),
('Mikel Oyarzabal'),
-- España 2022
('Marcos Llorente'),
('Jordi Alba'),
('Sergio Busquets'),
('Gavi'),
('Pedri'),
('Pablo Sarabia'),
('Álvaro Morata'),
('Marco Asensio'),
-- España 2014
('Iker Casillas'),
('César Azpilicueta'),
('Gerard Piqué'),
('Sergio Ramos'),
('Xabi Alonso'),
('Andrés Iniesta'),
('David Silva'),
('Pedro Rodríguez'),
('Diego Costa'),
-- España 2010
('Carles Puyol'),
('Joan Capdevila'),
('Xavi Hernández'),
('David Villa'),
-- España 1982
('Luis Arconada'),
('Alberto Urquiaga'),
('Luis Alesanco'),
('Miguel Tendillo'),
('José Antonio Camacho'),
('Periko Alonso'),
('Jesús Zamora'),
('Rafael Gordillo'),
('Juanito'),
('Santillana'),
('Jesús Satrústegui'),
-- Inglaterra 2026
('Jordan Pickford'),
('Reece James'),
('John Stones'),
('Marc Guéhi'),
('Djed Spence'),
('Declan Rice'),
('Elliot Anderson'),
('Jude Bellingham'),
('Morgan Rogers'),
('Harry Kane'),
('Anthony Gordon'),
-- Inglaterra 2022
('Kyle Walker'),
('Harry Maguire'),
('Luke Shaw'),
('Jordan Henderson'),
('Bukayo Saka'),
('Phil Foden'),
-- Inglaterra 2018
('Kieran Trippier'),
('Ashley Young'),
('Jesse Lingard'),
('Dele Alli'),
('Raheem Sterling'),
-- Inglaterra 2010
('David James'),
('Glen Johnson'),
('John Terry'),
('Matthew Upson'),
('Ashley Cole'),
('Aaron Lennon'),
('Frank Lampard'),
('Gareth Barry'),
('Steven Gerrard'),
('Wayne Rooney'),
('Jermain Defoe'),
-- Inglaterra 1998
('David Seaman'),
('Gary Neville'),
('Tony Adams'),
('Sol Campbell'),
('Graeme Le Saux'),
('David Beckham'),
('Paul Ince'),
('Paul Scholes'),
('Darren Anderton'),
('Michael Owen'),
('Alan Shearer'),
-- Inglaterra 1966
('Gordon Banks'),
('George Cohen'),
('Ray Wilson'),
('Bobby Moore'),
('Jack Charlton'),
('Nobby Stiles'),
('Bobby Charlton'),
('Alan Ball'),
('Martin Peters'),
('Geoff Hurst'),
('Roger Hunt'),
-- Portugal 2026
('Diogo Costa'),
('João Cancelo'),
('Rúben Dias'),
('Renato Veiga'),
('Nuno Mendes'),
('João Neves'),
('Vitinha'),
('Pedro Neto'),
('Bruno Fernandes'),
('João Félix'),
('Cristiano Ronaldo'),
-- Portugal 2018
('Rui Patrício'),
('Cédric Soares'),
('Pepe'),
('José Fonte'),
('Raphaël Guerreiro'),
('William Carvalho'),
('João Moutinho'),
('Bernardo Silva'),
('Gelson Martins'),
('Gonçalo Guedes'),
-- Portugal 2014
('Beto'),
('João Pereira'),
('Bruno Alves'),
('Ricardo Costa'),
('Fábio Coentrão'),
('Raul Meireles'),
('Miguel Veloso'),
('Nani'),
('Hélder Postiga'),
-- Portugal 2006
('Ricardo Pereira'),
('Paulo Ferreira'),
('Ricardo Carvalho'),
('Fernando Meira'),
('Nuno Valente'),
('Costinha'),
('Maniche'),
('Deco'),
('Luís Figo'),
('Pauleta'),
-- Portugal 2002
('Vítor Baía'),
('Abel Xavier'),
('Jorge Costa'),
('Fernando Couto'),
('Rui Jorge'),
('Paulo Sousa'),
('Sérgio Conceição'),
('Rui Costa'),
('João Vieira Pinto'),
-- Portugal 1966
('José Pereira'),
('Alberto Festa'),
('Alexandre Baptista'),
('Vicente Lucas'),
('Hilário'),
('Jaime Graça'),
('Mário Coluna'),
('José Augusto'),
('José Torres'),
('Eusébio'),
('António Simões'),
-- Hungría 1986
('Péter Disztl'),
('Sándor Sallai'),
('Imre Garaba'),
('József Kardos'),
('Antal Róth'),
('Lajos Détári'),
('Márton Esterházy'),
('Gyula Burcsa'),
('György Bognár'),
('József Kiprich'),
('Zoltán Péter'),
-- Hungría 1954
('Gyula Grosics'),
('Jenő Buzánszky'),
('Gyula Lóránt'),
('Mihály Lantos'),
('József Bozsik'),
('József Zakariás'),
('Zoltán Czibor'),
('Sándor Kocsis'),
('Nándor Hidegkuti'),
('Ferenc Puskás'),
('Mihály Tóth'),
-- México 2022
('Guillermo Ochoa'),
('Jorge Sánchez'),
('César Montes'),
('Héctor Moreno'),
('Jesús Gallardo'),
('Edson Álvarez'),
('Héctor Herrera'),
('Andrés Guardado'),
('Hirving Lozano'),
('Henry Martín'),
('Alexis Vega'),
-- México 1986
('Pablo Larios'),
('Rafael Amador'),
('Fernando Quirarte'),
('Carlos de los Cobos'),
('Raúl Servín'),
('Javier Aguirre'),
('Tomás Boy'),
('Manuel Negrete'),
('Miguel España'),
('Luis Flores'),
('Hugo Sánchez'),
-- Polonia 2022
('Wojciech Szczęsny'),
('Matty Cash'),
('Kamil Glik'),
('Jan Bednarek'),
('Bartosz Bereszyński'),
('Piotr Zieliński'),
('Krzysztof Krychowiak'),
('Przemysław Frankowski'),
('Nicola Zalewski'),
('Robert Lewandowski'),
('Arkadiusz Milik'),
-- Polonia 1982
('Józef Młynarczyk'),
('Paweł Janas'),
('Władysław Żmuda'),
('Antoni Szymanowski'),
('Marek Dziuba'),
('Andrzej Buncol'),
('Janusz Kupcewicz'),
('Zbigniew Boniek'),
('Włodzimierz Smolarek'),
('Grzegorz Lato'),
('Andrzej Szarmach'),
-- República Checa 2006
('Petr Čech'),
('Zdeněk Grygera'),
('Tomáš Ujfaluši'),
('Marek Jankulovski'),
('Tomáš Galásek'),
('Jan Polák'),
('Pavel Nedvěd'),
('Tomáš Rosický'),
('Jaroslav Plašil'),
('Jan Koller'),
('Milan Baroš'),
-- República Checa 1962
('Viliam Schrojf'),
('Jiří Tichý'),
('Ladislav Novák'),
('Svatopluk Pluskal'),
('Ján Popluhár'),
('Josef Masopust'),
('Andrej Kvašňák'),
('Adolf Scherer'),
('Josef Kadraba'),
('Josef Jelínek'),
('Jozef Adamec'),
-- Colombia 2014
('David Ospina'),
('Camilo Zúñiga'),
('Cristián Zapata'),
('Mario Yepes'),
('Pablo Armero'),
('Carlos Sánchez'),
('Abel Aguilar'),
('Juan Cuadrado'),
('James Rodríguez'),
('Teófilo Gutiérrez'),
('Jackson Martínez'),
-- Colombia 1994
('Óscar Córdoba'),
('Luis Herrera'),
('Luis Perea'),
('Andrés Escobar'),
('Wilson Pérez'),
('Carlos Valderrama'),
('Leonel Álvarez'),
('Freddy Rincón'),
('Gabriel Gómez'),
('Adolfo Valencia'),
('Faustino Asprilla'),
-- Corea del Sur 2018
('Cho Hyun-woo'),
('Lee Yong'),
('Kim Young-gwon'),
('Jang Hyun-soo'),
('Hong Chul'),
('Ki Sung-yueng'),
('Koo Ja-cheol'),
('Lee Jae-sung'),
('Hwang Hee-chan'),
('Son Heung-min'),
('Kim Shin-wook'),
-- Corea del Sur 2002
('Lee Woon-jae'),
('Choi Jin-cheul'),
('Hong Myung-bo'),
('Kim Tae-young'),
('Lee Young-pyo'),
('Yoo Sang-chul'),
('Kim Nam-il'),
('Park Ji-sung'),
('Song Chong-gug'),
('Ahn Jung-hwan'),
('Seol Ki-hyeon'),
-- Costa de Marfil 2014
('Boubacar Barry'),
('Serge Aurier'),
('Kolo Touré'),
('Sol Bamba'),
('Arthur Boka'),
('Yaya Touré'),
('Cheick Tioté'),
('Gervinho'),
('Wilfried Bony'),
('Didier Drogba'),
('Salomon Kalou'),
-- Costa de Marfil 2006
('Jean-Jacques Tizié'),
('Emmanuel Eboué'),
('Blaise Kouassi'),
('Abdoulaye Méïté'),
('Didier Zokora'),
('Gilles Yapi Yapo'),
('Bonaventure Kalou'),
('Aruna Dindane'),
-- Bulgaria 1998
('Zdravko Zdravkov'),
('Radostin Kishishev'),
('Trifon Ivanov'),
('Ivaylo Petkov'),
('Zlatko Yankov'),
('Krasimir Balakov'),
('Georgi Bachev'),
('Ivaylo Yordanov'),
('Hristo Stoichkov'),
('Luboslav Penev'),
('Stoyko Sakaliev'),
-- Bulgaria 1994
('Borislav Mihaylov'),
('Emil Kremenliev'),
('Petar Hubchev'),
('Iliyan Kiriakov'),
('Yordan Lechkov'),
('Daniel Borimirov'),
('Emil Kostadinov'),
-- Gales 2022
('Wayne Hennessey'),
('Connor Roberts'),
('Joe Rodon'),
('Ben Davies'),
('Neco Williams'),
('Ethan Ampadu'),
('Joe Allen'),
('Aaron Ramsey'),
('Harry Wilson'),
('Kieffer Moore'),
('Gareth Bale'),
-- Gales 1958
('Jack Kelsey'),
('Stuart Williams'),
('Mel Hopkins'),
('Dave Bowen'),
('Mel Charles'),
('Derek Sullivan'),
('Cliff Jones'),
('Ivor Allchurch'),
('Terry Medwin'),
('Colin Webster'),
('John Charles'),
-- Chile 1982
('Mario Osben'),
('Mario Soto'),
('Elías Figueroa'),
('René Valenzuela'),
('Rodolfo Dubó'),
('Eduardo Bonvallet'),
('Manuel Rojas'),
('Miguel Ángel Neira'),
('Patricio Yáñez'),
('Juan Carlos Letelier'),
('Carlos Caszely'),
-- Chile 1962
('Misael Escuti'),
('Luis Eyzaguirre'),
('Carlos Contreras'),
('Raúl Sánchez'),
('Sergio Navarro'),
('Jorge Toro'),
('Eladio Rojas'),
('Leonel Sánchez'),
('Jaime Ramírez'),
('Alberto Fouilloux'),
('Armando Tobar'),
-- Dinamarca 2022
('Kasper Schmeichel'),
('Joakim Mæhle'),
('Andreas Christensen'),
('Simon Kjær'),
('Joachim Andersen'),
('Rasmus Kristensen'),
('Thomas Delaney'),
('Pierre-Emile Højbjerg'),
('Christian Eriksen'),
('Andreas Skov Olsen'),
('Kasper Dolberg'),
-- Dinamarca 1998
('Peter Schmeichel'),
('Michael Schjønberg'),
('Marc Rieper'),
('Jes Høgh'),
('Søren Colding'),
('Thomas Helveg'),
('Allan Nielsen'),
('Morten Wieghorst'),
('Brian Laudrup'),
('Michael Laudrup'),
('Ebbe Sand'),
-- Noruega 1998
('Frode Grodås'),
('Vegard Heggem'),
('Henning Berg'),
('Dan Eggen'),
('Stig Inge Bjørnebye'),
('Erik Mykland'),
('Øyvind Leonhardsen'),
('Kjetil Rekdal'),
('Tore André Flo'),
('Ole Gunnar Solskjær'),
('Håvard Flo'),
-- Noruega 1994
('Erik Thorstvedt'),
('Rune Bratseth'),
('Gunnar Halle'),
('Lars Bohinen'),
('Jan Åge Fjørtoft'),
('Jahn Ivar Jakobsen'),
-- Japón 2022
('Shuichi Gonda'),
('Hiroki Sakai'),
('Maya Yoshida'),
('Ko Itakura'),
('Yuto Nagatomo'),
('Wataru Endo'),
('Hidemasa Morita'),
('Kaoru Mitoma'),
('Daichi Kamada'),
('Junya Ito'),
('Daizen Maeda'),
-- Japón 2014
('Eiji Kawashima'),
('Atsuto Uchida'),
('Masato Morishige'),
('Makoto Hasebe'),
('Yasuhito Endo'),
('Keisuke Honda'),
('Shinji Kagawa'),
('Shinji Okazaki'),
('Yuya Osako');

	INSERT INTO Plantillas (seleccion_id, mundial_id) VALUES
	(1, 1),
	(1, 2),	
	(1, 3),
	(1, 4),
	(1, 6),
	(1, 9),
	(1, 10),
	(1, 11),
	(1, 13),
	(1, 16),
	(2, 1),
	(2, 2),
	(2, 3),
	(2, 4),
	(2, 6),
	(2, 7),
	(2, 8),
	(2, 9),
	(2, 10),
	(2, 12),
	(2, 15),
	(2, 17),
	(2, 18),
	(3, 2),
	(3, 3),
	(3, 4),
	(3, 6),
	(3, 7),
	(3, 10),
	(3, 11),
	(3, 14),
	(4, 1),
	(4, 2),
	(4, 3),
	(4, 4),
	(4, 6),
	(4, 8),
	(4, 21),
	(5, 4),
	(5, 6),
	(5, 9),
	(5, 12),
	(5, 14),
	(5, 15),
	(6, 1),
	(6, 2),
	(6, 3),
	(6, 5),
	(6, 20),
	(7, 1),
	(7, 2),
	(7, 4),
	(7, 5),
	(7, 10),
	(7, 14),
	(8, 1),
	(8, 2),
	(8, 4),
	(8, 5),
	(8, 12),
	(9, 1),
	(9, 2),
	(9, 3),
	(9, 5),
	(9, 8),
	(9, 16),
	(10, 1),
	(10, 3),
	(10, 4),
	(10, 6),
	(10, 7),
	(10, 16),
	(11, 11),
	(11, 19),
	(12, 2),
	(12, 11),
	(13, 2),
	(13, 12),
	(14, 6),
	(14, 17),
	(15, 4),
	(15, 9),
	(16, 3),
	(16, 7),
	(17, 4),
	(17, 6),
	(18, 8),
	(18, 9),
	(19, 2),
	(19, 18),
	(20, 12),
	(20, 17),
	(21, 2),
	(21, 8),
	(22, 8),
	(22, 9),
	(23, 2),
	(23, 4);

	INSERT INTO PlantillaJugadores (plantilla_id, jugador_id, posicion, valoracion) VALUES
	-- Plantilla 1: Argentina 2026
	(1, 1, 'POR', 85), -- Emiliano Martínez
	(1, 2, 'DEF', 74), -- Gonzalo Montiel
	(1, 3, 'DEF', 86), -- Cristian Romero
	(1, 4, 'DEF', 84), -- Lisandro Martínez
	(1, 5, 'DEF', 78), -- Nicolás Tagliafico
	(1, 6, 'MED', 79), -- Rodrigo De Paul
	(1, 7, 'MED', 85), -- Enzo Fernández
	(1, 8, 'MED', 82), -- Alexis Mac Allister
	(1, 9, 'DEL', 75), -- Nicolás González
	(1, 10, 'DEL', 92), -- Lionel Messi
	(1, 11, 'DEL', 84), -- Julián Álvarez
	-- Plantilla 2: Argentina 2022
	(2, 1, 'POR', 90), -- Emiliano Martínez
	(2, 12, 'DEF', 79), -- Nahuel Molina
	(2, 3, 'DEF', 86), -- Cristian Romero
	(2, 13, 'DEF', 85), -- Nicolás Otamendi
	(2, 5, 'DEF', 82), -- Nicolás Tagliafico
	(2, 6, 'MED', 84), -- Rodrigo De Paul
	(2, 7, 'MED', 87), -- Enzo Fernández
	(2, 8, 'MED', 86), -- Alexis Mac Allister
	(2, 14, 'DEL', 88), -- Ángel Di María
	(2, 10, 'DEL', 98), -- Lionel Messi
	(2, 11, 'DEL', 87), -- Julián Álvarez
	-- Plantilla 3: Argentina 2018
	(3, 15, 'POR', 78), -- Franco Armani
	(3, 16, 'DEF', 74), -- Gabriel Mercado
	(3, 13, 'DEF', 79), -- Nicolás Otamendi
	(3, 17, 'DEF', 78), -- Marcos Rojo
	(3, 5, 'DEF', 76), -- Nicolás Tagliafico
	(3, 18, 'MED', 80), -- Javier Mascherano
	(3, 19, 'MED', 79), -- Éver Banega
	(3, 20, 'MED', 76), -- Enzo Pérez
	(3, 21, 'DEL', 74), -- Cristian Pavón
	(3, 14, 'DEL', 84), -- Ángel Di María
	(3, 10, 'DEL', 90), -- Lionel Messi
	-- Plantilla 4: Argentina 2014
	(4, 22, 'POR', 83), -- Sergio Romero
	(4, 23, 'DEF', 78), -- Pablo Zabaleta
	(4, 24, 'DEF', 82), -- Ezequiel Garay
	(4, 25, 'DEF', 77), -- Martín Demichelis
	(4, 17, 'DEF', 78), -- Marcos Rojo
	(4, 18, 'MED', 85), -- Javier Mascherano
	(4, 26, 'MED', 74), -- Lucas Biglia
	(4, 20, 'MED', 77), -- Enzo Pérez
	(4, 10, 'DEL', 94), -- Lionel Messi
	(4, 27, 'DEL', 77), -- Ezequiel Lavezzi
	(4, 28, 'DEL', 83), -- Gonzalo Higuaín
	-- Plantilla 5: Argentina 2006
	(5, 29, 'POR', 84), -- Roberto Abbondanzieri
	(5, 30, 'DEF', 78), -- Fabricio Coloccini
	(5, 31, 'DEF', 82), -- Roberto Ayala
	(5, 32, 'DEF', 81), -- Gabriel Heinze
	(5, 33, 'DEF', 80), -- Juan Pablo Sorín
	(5, 18, 'MED', 79), -- Javier Mascherano
	(5, 34, 'MED', 82), -- Esteban Cambiasso
	(5, 35, 'MED', 80), -- Maxi Rodríguez
	(5, 36, 'MED', 90), -- Juan Román Riquelme
	(5, 37, 'DEL', 84), -- Hernán Crespo
	(5, 38, 'DEL', 82), -- Carlos Tevez
	-- Plantilla 6: Argentina 1994
	(6, 39, 'POR', 78), -- Luis Islas
	(6, 40, 'DEF', 82), -- Néstor Sensini
	(6, 41, 'DEF', 83), -- Oscar Ruggeri
	(6, 42, 'DEF', 78), -- José Chamot
	(6, 43, 'DEF', 76), -- Sergio Vázquez
	(6, 44, 'MED', 85), -- Fernando Redondo
	(6, 45, 'MED', 82), -- Diego Simeone
	(6, 61, 'MED', 90), -- Diego Maradona
	(6, 46, 'DEL', 85), -- Claudio Caniggia
	(6, 47, 'DEL', 90), -- Gabriel Batistuta
	(6, 48, 'DEL', 82), -- Abel Balbo
	-- Plantilla 7: Argentina 1990
	(7, 49, 'POR', 85), -- Sergio Goycochea
	(7, 50, 'DEF', 78), -- Juan Simón
	(7, 51, 'DEF', 78), -- José Serrizuela
	(7, 41, 'DEF', 83), -- Oscar Ruggeri
	(7, 52, 'DEF', 76), -- Julio Olarticoechea
	(7, 53, 'MED', 79), -- Ricardo Giusti
	(7, 54, 'MED', 78), -- Jorge Basualdo
	(7, 55, 'MED', 82), -- Jorge Burruchaga
	(7, 56, 'MED', 77), -- Pedro Troglio
	(7, 61, 'DEL', 94), -- Diego Maradona
	(7, 46, 'DEL', 85), -- Claudio Caniggia
	-- Plantilla 8: Argentina 1986
	(8, 57, 'POR', 80), -- Nery Pumpido
	(8, 58, 'DEF', 80), -- José Cuciuffo
	(8, 59, 'DEF', 82), -- José Luis Brown
	(8, 41, 'DEF', 84), -- Oscar Ruggeri
	(8, 52, 'DEF', 78), -- Julio Olarticoechea
	(8, 53, 'MED', 80), -- Ricardo Giusti
	(8, 60, 'MED', 80), -- Sergio Batista
	(8, 62, 'MED', 78), -- Héctor Enrique
	(8, 55, 'MED', 84), -- Jorge Burruchaga
	(8, 61, 'DEL', 99), -- Diego Maradona
	(8, 63, 'DEL', 85), -- Jorge Valdano
	-- Plantilla 9: Argentina 1978
	(9, 64, 'POR', 86), -- Ubaldo Fillol
	(9, 65, 'DEF', 82), -- Jorge Olguín
	(9, 66, 'DEF', 90), -- Daniel Passarella
	(9, 67, 'DEF', 82), -- Luis Galván
	(9, 68, 'DEF', 80), -- Alberto Tarantini
	(9, 69, 'MED', 80), -- Américo Gallego
	(9, 70, 'MED', 85), -- Osvaldo Ardiles
	(9, 71, 'MED', 82), -- Daniel Bertoni
	(9, 72, 'DEL', 84), -- Leopoldo Luque
	(9, 73, 'DEL', 92), -- Mario Kempes
	(9, 74, 'DEL', 78), -- Oscar Ortiz
	-- Plantilla 10: Argentina 1966
	(10, 75, 'POR', 82), -- Antonio Roma
	(10, 76, 'DEF', 76), -- Roberto Ferreiro
	(10, 77, 'DEF', 80), -- Roberto Perfumo
	(10, 78, 'DEF', 77), -- Rafael Albrecht
	(10, 79, 'DEF', 86), -- Silvio Marzolini
	(10, 80, 'MED', 84), -- Antonio Rattín
	(10, 81, 'MED', 76), -- Jorge Solari
	(10, 82, 'MED', 75), -- Alberto González
	(10, 83, 'MED', 78), -- Ermindo Onega
	(10, 84, 'DEL', 76), -- Oscar Más
	(10, 85, 'DEL', 82), -- Luis Artime
	-- Plantilla 11: Brasil 2026
	(11, 86, 'POR', 89), -- Alisson
	(11, 87, 'DEF', 78), -- Danilo
	(11, 88, 'DEF', 86), -- Marquinhos
	(11, 89, 'DEF', 85), -- Gabriel Magalhães
	(11, 90, 'DEF', 76), -- Douglas Santos
	(11, 91, 'MED', 82), -- Casemiro
	(11, 92, 'MED', 84), -- Bruno Guimarães
	(11, 93, 'MED', 82), -- Lucas Paquetá
	(11, 94, 'DEL', 76), -- Rayan
	(11, 95, 'DEL', 82), -- Matheus Cunha
	(11, 96, 'DEL', 89), -- Vinícius Júnior
	-- Plantilla 12: Brasil 2022
	(12, 86, 'POR', 90), -- Alisson
	(12, 87, 'DEF', 80), -- Danilo
	(12, 88, 'DEF', 86), -- Marquinhos
	(12, 97, 'DEF', 85), -- Thiago Silva
	(12, 98, 'DEF', 79), -- Alex Sandro
	(12, 91, 'MED', 88), -- Casemiro
	(12, 93, 'MED', 82), -- Lucas Paquetá
	(12, 100, 'MED', 91), -- Neymar
	(12, 99, 'DEL', 83), -- Raphinha
	(12, 96, 'DEL', 86), -- Vinícius Júnior
	(12, 101, 'DEL', 82), -- Richarlison
	-- Plantilla 13: Brasil 2018
	(13, 86, 'POR', 88), -- Alisson
	(13, 102, 'DEF', 76), -- Fagner
	(13, 97, 'DEF', 85), -- Thiago Silva
	(13, 103, 'DEF', 84), -- Miranda
	(13, 104, 'DEF', 86), -- Marcelo
	(13, 105, 'MED', 81), -- Fernandinho
	(13, 106, 'MED', 82), -- Paulinho
	(13, 108, 'MED', 86), -- Philippe Coutinho
	(13, 107, 'DEL', 82), -- Willian
	(13, 100, 'DEL', 92), -- Neymar
	(13, 109, 'DEL', 80), -- Gabriel Jesus
	-- Plantilla 14: Brasil 2014
	(14, 110, 'POR', 82), -- Júlio César
	(14, 111, 'DEF', 85), -- Dani Alves
	(14, 97, 'DEF', 87), -- Thiago Silva
	(14, 112, 'DEF', 84), -- David Luiz
	(14, 104, 'DEF', 84), -- Marcelo
	(14, 113, 'MED', 80), -- Luiz Gustavo
	(14, 106, 'MED', 79), -- Paulinho
	(14, 114, 'MED', 83), -- Oscar
	(14, 115, 'DEL', 80), -- Hulk
	(14, 100, 'DEL', 93), -- Neymar
	(14, 116, 'DEL', 74), -- Fred
	-- Plantilla 15: Brasil 2006
	(15, 117, 'POR', 84), -- Dida
	(15, 118, 'DEF', 88), -- Cafu
	(15, 119, 'DEF', 88), -- Lúcio
	(15, 120, 'DEF', 84), -- Juan
	(15, 121, 'DEF', 88), -- Roberto Carlos
	(15, 122, 'MED', 84), -- Gilberto Silva
	(15, 123, 'MED', 82), -- Zé Roberto
	(15, 124, 'MED', 89), -- Kaká
	(15, 125, 'DEL', 91), -- Ronaldinho
	(15, 126, 'DEL', 90), -- Ronaldo
	(15, 127, 'DEL', 85), -- Adriano
	-- Plantilla 16: Brasil 2002
	(16, 128, 'POR', 87), -- Marcos
	(16, 119, 'DEF', 84), -- Lúcio
	(16, 129, 'DEF', 84), -- Edmílson
	(16, 130, 'DEF', 80), -- Roque Júnior
	(16, 118, 'DEF', 90), -- Cafu
	(16, 121, 'DEF', 90), -- Roberto Carlos
	(16, 122, 'MED', 82), -- Gilberto Silva
	(16, 131, 'MED', 80), -- Kléberson
	(16, 125, 'MED', 88), -- Ronaldinho
	(16, 132, 'DEL', 93), -- Rivaldo
	(16, 126, 'DEL', 96), -- Ronaldo
	-- Plantilla 17: Brasil 1998
	(17, 133, 'POR', 87), -- Taffarel
	(17, 118, 'DEF', 88), -- Cafu
	(17, 134, 'DEF', 85), -- Aldair
	(17, 135, 'DEF', 78), -- Júnior Baiano
	(17, 121, 'DEF', 88), -- Roberto Carlos
	(17, 136, 'MED', 80), -- Dunga
	(17, 137, 'MED', 80), -- César Sampaio
	(17, 138, 'MED', 82), -- Leonardo
	(17, 132, 'MED', 88), -- Rivaldo
	(17, 139, 'DEL', 84), -- Bebeto
	(17, 126, 'DEL', 94), -- Ronaldo
	-- Plantilla 18: Brasil 1994
	(18, 133, 'POR', 88), -- Taffarel
	(18, 140, 'DEF', 82), -- Jorginho
	(18, 134, 'DEF', 85), -- Aldair
	(18, 141, 'DEF', 82), -- Márcio Santos
	(18, 142, 'DEF', 82), -- Branco
	(18, 143, 'MED', 84), -- Mauro Silva
	(18, 136, 'MED', 83), -- Dunga
	(18, 144, 'MED', 80), -- Mazinho
	(18, 145, 'MED', 82), -- Zinho
	(18, 139, 'DEL', 88), -- Bebeto
	(18, 146, 'DEL', 93), -- Romário
	-- Plantilla 19: Brasil 1990
	(19, 133, 'POR', 84), -- Taffarel
	(19, 140, 'DEF', 80), -- Jorginho
	(19, 148, 'DEF', 80), -- Mauro Galvão
	(19, 147, 'DEF', 82), -- Ricardo Gomes
	(19, 149, 'DEF', 80), -- Mozer
	(19, 142, 'DEF', 81), -- Branco
	(19, 136, 'MED', 80), -- Dunga
	(19, 150, 'MED', 84), -- Alemão
	(19, 151, 'MED', 82), -- Valdo
	(19, 153, 'DEL', 88), -- Careca
	(19, 152, 'DEL', 83), -- Muller
	-- Plantilla 20: Brasil 1982
	(20, 154, 'POR', 76), -- Waldir Peres
	(20, 155, 'DEF', 85), -- Leandro
	(20, 114, 'DEF', 82), -- Oscar
	(20, 156, 'DEF', 84), -- Luizinho
	(20, 157, 'DEF', 87), -- Júnior
	(20, 158, 'MED', 88), -- Cerezo
	(20, 159, 'MED', 88), -- Falcão
	(20, 160, 'MED', 89), -- Sócrates
	(20, 161, 'MED', 93), -- Zico
	(20, 162, 'DEL', 84), -- Éder
	(20, 163, 'DEL', 78), -- Serginho Chulapa
	-- Plantilla 21: Brasil 1970
	(21, 164, 'POR', 76), -- Félix
	(21, 165, 'DEF', 90), -- Carlos Alberto Torres
	(21, 166, 'DEF', 80), -- Brito
	(21, 167, 'DEF', 82), -- Piazza
	(21, 168, 'DEF', 80), -- Everaldo
	(21, 169, 'MED', 86), -- Clodoaldo
	(21, 170, 'MED', 90), -- Gérson
	(21, 174, 'MED', 88), -- Rivellino
	(21, 171, 'DEL', 89), -- Jairzinho
	(21, 172, 'DEL', 84), -- Tostão
	(21, 173, 'DEL', 98), -- Pelé
	-- Plantilla 22: Brasil 1962
	(22, 175, 'POR', 88), -- Gilmar
	(22, 176, 'DEF', 92), -- Djalma Santos
	(22, 177, 'DEF', 82), -- Mauro
	(22, 178, 'DEF', 78), -- Zózimo
	(22, 179, 'DEF', 90), -- Nilton Santos
	(22, 180, 'MED', 84), -- Zito
	(22, 181, 'MED', 90), -- Didi
	(22, 185, 'MED', 82), -- Zagallo
	(22, 182, 'DEL', 95), -- Garrincha
	(22, 183, 'DEL', 88), -- Vavá
	(22, 184, 'DEL', 85), -- Amarildo
	-- Plantilla 23: Brasil 1958
	(23, 175, 'POR', 86), -- Gilmar
	(23, 176, 'DEF', 90), -- Djalma Santos
	(23, 186, 'DEF', 84), -- Bellini
	(23, 187, 'DEF', 80), -- Orlando
	(23, 179, 'DEF', 90), -- Nilton Santos
	(23, 180, 'MED', 82), -- Zito
	(23, 181, 'MED', 92), -- Didi
	(23, 185, 'MED', 84), -- Zagallo
	(23, 182, 'DEL', 94), -- Garrincha
	(23, 183, 'DEL', 88), -- Vavá
	(23, 173, 'DEL', 94), -- Pelé
	-- Plantilla 24: Alemania 2022
	(24, 188, 'POR', 88), -- Manuel Neuer
	(24, 189, 'DEF', 80), -- Niklas Süle
	(24, 190, 'DEF', 85), -- Antonio Rüdiger
	(24, 191, 'DEF', 79), -- Nico Schlotterbeck
	(24, 192, 'DEF', 76), -- David Raum
	(24, 193, 'MED', 87), -- Joshua Kimmich
	(24, 194, 'MED', 85), -- Ilkay Gündogan
	(24, 196, 'MED', 85), -- Jamal Musiala
	(24, 195, 'DEL', 82), -- Serge Gnabry
	(24, 197, 'DEL', 82), -- Thomas Müller
	(24, 198, 'DEL', 82), -- Kai Havertz
	-- Plantilla 25: Alemania 2018
	(25, 188, 'POR', 89), -- Manuel Neuer
	(25, 193, 'DEF', 84), -- Joshua Kimmich
	(25, 199, 'DEF', 85), -- Jérôme Boateng
	(25, 200, 'DEF', 86), -- Mats Hummels
	(25, 201, 'DEF', 78), -- Jonas Hector
	(25, 202, 'MED', 80), -- Sami Khedira
	(25, 203, 'MED', 91), -- Toni Kroos
	(25, 204, 'MED', 84), -- Mesut Özil
	(25, 205, 'DEL', 84), -- Marco Reus
	(25, 206, 'DEL', 80), -- Julian Draxler
	(25, 207, 'DEL', 82), -- Timo Werner
	-- Plantilla 26: Alemania 2014
	(26, 188, 'POR', 97), -- Manuel Neuer
	(26, 208, 'DEF', 90), -- Philipp Lahm
	(26, 199, 'DEF', 86), -- Jérôme Boateng
	(26, 200, 'DEF', 87), -- Mats Hummels
	(26, 209, 'DEF', 82), -- Benedikt Höwedes
	(26, 210, 'MED', 90), -- Bastian Schweinsteiger
	(26, 211, 'MED', 75), -- Christoph Kramer
	(26, 203, 'MED', 90), -- Toni Kroos
	(26, 204, 'MED', 86), -- Mesut Özil
	(26, 197, 'DEL', 90), -- Thomas Müller
	(26, 212, 'DEL', 85), -- Miroslav Klose
	-- Plantilla 27: Alemania 2006
	(27, 213, 'POR', 85), -- Jens Lehmann
	(27, 214, 'DEF', 80), -- Arne Friedrich
	(27, 215, 'DEF', 80), -- Per Mertesacker
	(27, 216, 'DEF', 80), -- Christoph Metzelder
	(27, 208, 'DEF', 82), -- Philipp Lahm
	(27, 217, 'MED', 82), -- Bernd Schneider
	(27, 218, 'MED', 84), -- Torsten Frings
	(27, 219, 'MED', 90), -- Michael Ballack
	(27, 210, 'MED', 82), -- Bastian Schweinsteiger
	(27, 212, 'DEL', 90), -- Miroslav Klose
	(27, 220, 'DEL', 80), -- Lukas Podolski
	-- Plantilla 28: Alemania 2002
	(28, 221, 'POR', 95), -- Oliver Kahn
	(28, 222, 'DEF', 82), -- Thomas Linke
	(28, 223, 'DEF', 76), -- Carsten Ramelow
	(28, 216, 'DEF', 78), -- Christoph Metzelder
	(28, 218, 'MED', 80), -- Torsten Frings
	(28, 224, 'MED', 83), -- Dietmar Hamann
	(28, 225, 'MED', 78), -- Jens Jeremies
	(28, 217, 'MED', 82), -- Bernd Schneider
	(28, 219, 'MED', 88), -- Michael Ballack
	(28, 226, 'DEL', 82), -- Oliver Neuville
	(28, 212, 'DEL', 84), -- Miroslav Klose
	-- Plantilla 29: Alemania 1990
	(29, 227, 'POR', 82), -- Bodo Illgner
	(29, 228, 'DEF', 84), -- Klaus Augenthaler
	(29, 229, 'DEF', 86), -- Guido Buchwald
	(29, 230, 'DEF', 86), -- Jürgen Kohler
	(29, 231, 'DEF', 80), -- Thomas Berthold
	(29, 232, 'DEF', 88), -- Andreas Brehme
	(29, 233, 'MED', 95), -- Lothar Matthäus
	(29, 234, 'MED', 84), -- Thomas Hässler
	(29, 235, 'MED', 86), -- Pierre Littbarski
	(29, 236, 'DEL', 88), -- Jürgen Klinsmann
	(29, 237, 'DEL', 88), -- Rudi Völler
	-- Plantilla 30: Alemania 1986
	(30, 238, 'POR', 86), -- Harald Schumacher
	(30, 231, 'DEF', 82), -- Thomas Berthold
	(30, 239, 'DEF', 80), -- Ditmar Jakobs
	(30, 240, 'DEF', 85), -- Karlheinz Förster
	(30, 241, 'DEF', 86), -- Hans-Peter Briegel
	(30, 243, 'MED', 80), -- Norbert Eder
	(30, 232, 'MED', 82), -- Andreas Brehme
	(30, 242, 'MED', 82), -- Felix Magath
	(30, 233, 'MED', 90), -- Lothar Matthäus
	(30, 244, 'DEL', 88), -- Karl-Heinz Rummenigge
	(30, 245, 'DEL', 82), -- Klaus Allofs
	-- Plantilla 31: Alemania 1974
	(31, 246, 'POR', 90), -- Sepp Maier
	(31, 247, 'DEF', 88), -- Berti Vogts
	(31, 248, 'DEF', 97), -- Franz Beckenbauer
	(31, 249, 'DEF', 84), -- Hans-Georg Schwarzenbeck
	(31, 250, 'DEF', 88), -- Paul Breitner
	(31, 251, 'MED', 86), -- Rainer Bonhof
	(31, 252, 'MED', 90), -- Wolfgang Overath
	(31, 253, 'MED', 82), -- Uli Hoeneß
	(31, 254, 'DEL', 83), -- Jürgen Grabowski
	(31, 255, 'DEL', 95), -- Gerd Müller
	(31, 256, 'DEL', 82), -- Bernd Hölzenbein
	-- Plantilla 32: Francia 2026
	(32, 257, 'POR', 89), -- Mike Maignan
	(32, 258, 'DEF', 87), -- Jules Koundé
	(32, 259, 'DEF', 84), -- Dayot Upamecano
	(32, 260, 'DEF', 87), -- William Saliba
	(32, 261, 'DEF', 78), -- Lucas Digne
	(32, 262, 'MED', 85), -- Aurélien Tchouaméni
	(32, 263, 'MED', 83), -- Adrien Rabiot
	(32, 265, 'MED', 85), -- Michael Olise
	(32, 264, 'DEL', 90), -- Ousmane Dembélé
	(32, 266, 'DEL', 82), -- Bradley Barcola
	(32, 267, 'DEL', 95), -- Kylian Mbappé
	-- Plantilla 33: Francia 2022
	(33, 268, 'POR', 87), -- Hugo Lloris
	(33, 258, 'DEF', 83), -- Jules Koundé
	(33, 269, 'DEF', 86), -- Raphaël Varane
	(33, 259, 'DEF', 83), -- Dayot Upamecano
	(33, 270, 'DEF', 85), -- Theo Hernández
	(33, 262, 'MED', 85), -- Aurélien Tchouaméni
	(33, 263, 'MED', 82), -- Adrien Rabiot
	(33, 271, 'MED', 90), -- Antoine Griezmann
	(33, 264, 'DEL', 83), -- Ousmane Dembélé
	(33, 272, 'DEL', 82), -- Olivier Giroud
	(33, 267, 'DEL', 96), -- Kylian Mbappé
	-- Plantilla 34: Francia 2018
	(34, 268, 'POR', 87), -- Hugo Lloris
	(34, 273, 'DEF', 80), -- Benjamin Pavard
	(34, 269, 'DEF', 87), -- Raphaël Varane
	(34, 274, 'DEF', 85), -- Samuel Umtiti
	(34, 275, 'DEF', 80), -- Lucas Hernandez
	(34, 276, 'MED', 90), -- NGolo Kanté
	(34, 277, 'MED', 88), -- Paul Pogba
	(34, 278, 'MED', 82), -- Blaise Matuidi
	(34, 271, 'DEL', 93), -- Antoine Griezmann
	(34, 267, 'DEL', 93), -- Kylian Mbappé
	(34, 272, 'DEL', 80), -- Olivier Giroud
	-- Plantilla 35: Francia 2014
	(35, 268, 'POR', 86), -- Hugo Lloris
	(35, 279, 'DEF', 80), -- Mathieu Debuchy
	(35, 269, 'DEF', 82), -- Raphaël Varane
	(35, 280, 'DEF', 79), -- Mamadou Sakho
	(35, 281, 'DEF', 80), -- Patrice Evra
	(35, 282, 'MED', 80), -- Yohan Cabaye
	(35, 277, 'MED', 84), -- Paul Pogba
	(35, 278, 'MED', 82), -- Blaise Matuidi
	(35, 283, 'MED', 80), -- Mathieu Valbuena
	(35, 271, 'DEL', 78), -- Antoine Griezmann
	(35, 284, 'DEL', 83), -- Karim Benzema
	-- Plantilla 36: Francia 2006
	(36, 285, 'POR', 84), -- Fabien Barthez
	(36, 286, 'DEF', 84), -- Willy Sagnol
	(36, 287, 'DEF', 88), -- Lilian Thuram
	(36, 288, 'DEF', 84), -- William Gallas
	(36, 289, 'DEF', 80), -- Éric Abidal
	(36, 290, 'MED', 88), -- Patrick Vieira
	(36, 291, 'MED', 88), -- Claude Makélélé
	(36, 292, 'MED', 82), -- Franck Ribéry
	(36, 293, 'MED', 94), -- Zinedine Zidane
	(36, 294, 'DEL', 80), -- Florent Malouda
	(36, 295, 'DEL', 91), -- Thierry Henry
	-- Plantilla 37: Francia 1998
	(37, 285, 'POR', 86), -- Fabien Barthez
	(37, 287, 'DEF', 86), -- Lilian Thuram
	(37, 297, 'DEF', 82), -- Frank Leboeuf
	(37, 296, 'DEF', 90), -- Marcel Desailly
	(37, 298, 'DEF', 85), -- Bixente Lizarazu
	(37, 300, 'MED', 83), -- Didier Deschamps
	(37, 301, 'MED', 85), -- Emmanuel Petit
	(37, 299, 'MED', 80), -- Christian Karembeu
	(37, 293, 'MED', 95), -- Zinedine Zidane
	(37, 302, 'DEL', 86), -- Youri Djorkaeff
	(37, 303, 'DEL', 80), -- Stéphane Guivarch
	-- Plantilla 38: Francia 1938
	(38, 304, 'POR', 72), -- Laurent Di Lorto
	(38, 305, 'DEF', 76), -- Étienne Mattler
	(38, 306, 'DEF', 78), -- Raoul Diagne
	(38, 307, 'DEF', 74), -- Jules Vandooren
	(38, 308, 'DEF', 72), -- Lucien Jasseron
	(38, 309, 'MED', 76), -- Edmond Delfour
	(38, 310, 'MED', 72), -- Émile Veinante
	(38, 311, 'MED', 75), -- Oscar Heisserer
	(38, 312, 'DEL', 82), -- Jean Nicolas
	(38, 313, 'DEL', 76), -- Fred Aston
	(38, 314, 'DEL', 74), -- Ignace Kowalczyk
	-- Plantilla 39: Italia 2014
	(39, 315, 'POR', 88), -- Gianluigi Buffon
	(39, 316, 'DEF', 76), -- Mattia De Sciglio
	(39, 317, 'DEF', 82), -- Andrea Barzagli
	(39, 318, 'DEF', 84), -- Giorgio Chiellini
	(39, 319, 'DEF', 76), -- Matteo Darmian
	(39, 320, 'MED', 88), -- Andrea Pirlo
	(39, 321, 'MED', 82), -- Marco Verratti
	(39, 322, 'MED', 82), -- Claudio Marchisio
	(39, 323, 'DEL', 78), -- Antonio Candreva
	(39, 324, 'DEL', 82), -- Mario Balotelli
	(39, 325, 'DEL', 78), -- Ciro Immobile
	-- Plantilla 40: Italia 2006
	(40, 315, 'POR', 94), -- Gianluigi Buffon
	(40, 326, 'DEF', 86), -- Gianluca Zambrotta
	(40, 327, 'DEF', 94), -- Fabio Cannavaro
	(40, 328, 'DEF', 84), -- Marco Materazzi
	(40, 329, 'DEF', 83), -- Fabio Grosso
	(40, 330, 'MED', 85), -- Gennaro Gattuso
	(40, 320, 'MED', 91), -- Andrea Pirlo
	(40, 331, 'MED', 82), -- Mauro Camoranesi
	(40, 332, 'MED', 80), -- Simone Perrotta
	(40, 333, 'DEL', 88), -- Francesco Totti
	(40, 334, 'DEL', 86), -- Luca Toni
	-- Plantilla 41: Italia 1994
	(41, 335, 'POR', 84), -- Gianluca Pagliuca
	(41, 336, 'DEF', 78), -- Roberto Mussi
	(41, 337, 'DEF', 91), -- Franco Baresi
	(41, 338, 'DEF', 90), -- Paolo Maldini
	(41, 339, 'DEF', 78), -- Antonio Benarrivo
	(41, 340, 'MED', 82), -- Nicola Berti
	(41, 341, 'MED', 82), -- Dino Baggio
	(41, 342, 'MED', 83), -- Demetrio Albertini
	(41, 343, 'MED', 84), -- Roberto Donadoni
	(41, 344, 'DEL', 80), -- Daniele Massaro
	(41, 345, 'DEL', 94), -- Roberto Baggio
	-- Plantilla 42: Italia 1982
	(42, 346, 'POR', 90), -- Dino Zoff
	(42, 347, 'DEF', 88), -- Claudio Gentile
	(42, 348, 'DEF', 82), -- Fulvio Collovati
	(42, 349, 'DEF', 92), -- Gaetano Scirea
	(42, 350, 'DEF', 84), -- Antonio Cabrini
	(42, 351, 'MED', 80), -- Gabriele Oriali
	(42, 352, 'MED', 88), -- Marco Tardelli
	(42, 353, 'MED', 88), -- Giancarlo Antognoni
	(42, 354, 'DEL', 87), -- Bruno Conti
	(42, 355, 'DEL', 92), -- Paolo Rossi
	(42, 356, 'DEL', 82), -- Francesco Graziani
	-- Plantilla 43: Italia 1974
	(43, 346, 'POR', 88), -- Dino Zoff
	(43, 357, 'DEF', 76), -- Luciano Spinosi
	(43, 358, 'DEF', 86), -- Giacinto Facchetti
	(43, 359, 'DEF', 82), -- Tarcisio Burgnich
	(43, 360, 'MED', 82), -- Romeo Benetti
	(43, 361, 'MED', 82), -- Fabio Capello
	(43, 362, 'MED', 88), -- Gianni Rivera
	(43, 363, 'MED', 88), -- Sandro Mazzola
	(43, 364, 'MED', 80), -- Franco Causio
	(43, 365, 'DEL', 80), -- Pietro Anastasi
	(43, 366, 'DEL', 83), -- Giorgio Chinaglia
	-- Plantilla 44: Italia 1970
	(44, 367, 'POR', 85), -- Enrico Albertosi
	(44, 359, 'DEF', 85), -- Tarcisio Burgnich
	(44, 358, 'DEF', 90), -- Giacinto Facchetti
	(44, 369, 'DEF', 84), -- Roberto Rosato
	(44, 368, 'DEF', 84), -- Pierluigi Cera
	(44, 370, 'MED', 80), -- Mario Bertini
	(44, 371, 'MED', 82), -- Giancarlo De Sisti
	(44, 372, 'MED', 82), -- Angelo Domenghini
	(44, 363, 'MED', 90), -- Sandro Mazzola
	(44, 373, 'DEL', 86), -- Roberto Boninsegna
	(44, 374, 'DEL', 92), -- Luigi Riva
	-- Plantilla 45: Uruguay 2026
	(45, 375, 'POR', 78), -- Fernando Muslera
	(45, 376, 'DEF', 78), -- Guillermo Varela
	(45, 377, 'DEF', 78), -- Sebastián Cáceres
	(45, 378, 'DEF', 80), -- Mathías Olivera
	(45, 379, 'DEF', 77), -- Matías Viña
	(45, 380, 'MED', 83), -- Manuel Ugarte
	(45, 381, 'MED', 80), -- Rodrigo Bentancur
	(45, 382, 'MED', 86), -- Federico Valverde
	(45, 383, 'MED', 78), -- Maxi Araújo
	(45, 384, 'DEL', 72), -- Federico Viñas
	(45, 385, 'DEL', 83), -- Darwin Núñez
	-- Plantilla 46: Uruguay 2022
	(46, 386, 'POR', 78), -- Sergio Rochet
	(46, 376, 'DEF', 78), -- Guillermo Varela
	(46, 387, 'DEF', 85), -- José María Giménez
	(46, 388, 'DEF', 82), -- Diego Godín
	(46, 379, 'DEF', 76), -- Matías Viña
	(46, 382, 'MED', 84), -- Federico Valverde
	(46, 381, 'MED', 84), -- Rodrigo Bentancur
	(46, 389, 'MED', 82), -- Giorgian De Arrascaeta
	(46, 390, 'DEL', 76), -- Facundo Pellistri
	(46, 391, 'DEL', 83), -- Edinson Cavani
	(46, 392, 'DEL', 83), -- Luis Suárez
	-- Plantilla 47: Uruguay 2018
	(47, 375, 'POR', 85), -- Fernando Muslera
	(47, 376, 'DEF', 80), -- Guillermo Varela
	(47, 387, 'DEF', 81), -- José María Giménez
	(47, 388, 'DEF', 86), -- Diego Godín
	(47, 393, 'DEF', 76), -- Diego Laxalt
	(47, 394, 'MED', 80), -- Nahitan Nández
	(47, 395, 'MED', 82), -- Lucas Torreira
	(47, 396, 'MED', 78), -- Matías Vecino
	(47, 381, 'MED', 80), -- Rodrigo Bentancur
	(47, 391, 'DEL', 85), -- Edinson Cavani
	(47, 392, 'DEL', 88), -- Luis Suárez
	-- Plantilla 48: Uruguay 2010
	(48, 375, 'POR', 82), -- Fernando Muslera
	(48, 397, 'DEF', 82), -- Maxi Pereira
	(48, 398, 'DEF', 84), -- Diego Lugano
	(48, 388, 'DEF', 82), -- Diego Godín
	(48, 399, 'DEF', 76), -- Jorge Fucile
	(48, 400, 'MED', 78), -- Egidio Arévalo
	(48, 401, 'MED', 80), -- Diego Pérez
	(48, 402, 'MED', 80), -- Álvaro Pereira
	(48, 403, 'DEL', 90), -- Diego Forlán
	(48, 392, 'DEL', 87), -- Luis Suárez
	(48, 391, 'DEL', 82), -- Edinson Cavani
	-- Plantilla 49: Uruguay 1950
	(49, 404, 'POR', 85), -- Roque Máspoli
	(49, 405, 'DEF', 82), -- Matías González
	(49, 406, 'DEF', 82), -- Eusebio Tejera
	(49, 407, 'DEF', 80), -- Schubert Gambetta
	(49, 408, 'MED', 86), -- Víctor Rodríguez Andrade
	(49, 409, 'MED', 88), -- Obdulio Varela
	(49, 411, 'MED', 82), -- Julio Pérez
	(49, 413, 'MED', 88), -- Juan Alberto Schiaffino
	(49, 410, 'DEL', 85), -- Alcides Ghiggia
	(49, 412, 'DEL', 84), -- Óscar Míguez
	(49, 414, 'DEL', 80), -- Rubén Morán
	-- Plantilla 50: Países Bajos 2026
	(50, 415, 'POR', 80), -- Bart Verbruggen
	(50, 416, 'DEF', 82), -- Denzel Dumfries
	(50, 417, 'DEF', 76), -- Jan Paul van Hecke
	(50, 418, 'DEF', 89), -- Virgil van Dijk
	(50, 419, 'DEF', 82), -- Micky van de Ven
	(50, 420, 'MED', 86), -- Frenkie de Jong
	(50, 421, 'MED', 85), -- Ryan Gravenberch
	(50, 422, 'MED', 84), -- Tijjani Reijnders
	(50, 423, 'DEL', 84), -- Cody Gakpo
	(50, 424, 'DEL', 80), -- Donyell Malen
	(50, 425, 'DEL', 78), -- Brian Brobbey
	-- Plantilla 51: Países Bajos 2022
	(51, 426, 'POR', 76), -- Andries Noppert
	(51, 427, 'DEF', 80), -- Jurriën Timber
	(51, 428, 'DEF', 82), -- Nathan Aké
	(51, 418, 'DEF', 88), -- Virgil van Dijk
	(51, 416, 'DEF', 80), -- Denzel Dumfries
	(51, 430, 'DEF', 78), -- Daley Blind
	(51, 420, 'MED', 86), -- Frenkie de Jong
	(51, 429, 'MED', 78), -- Davy Klaassen
	(51, 431, 'DEL', 77), -- Steven Bergwijn
	(51, 432, 'DEL', 85), -- Memphis Depay
	(51, 423, 'DEL', 84), -- Cody Gakpo
	-- Plantilla 52: Países Bajos 2014
	(52, 433, 'POR', 82), -- Jasper Cillessen
	(52, 434, 'DEF', 80), -- Ron Vlaar
	(52, 435, 'DEF', 80), -- Stefan de Vrij
	(52, 436, 'DEF', 78), -- Bruno Martins Indi
	(52, 430, 'DEF', 80), -- Daley Blind
	(52, 437, 'MED', 78), -- Dirk Kuyt
	(52, 438, 'MED', 80), -- Nigel de Jong
	(52, 440, 'MED', 78), -- Georginio Wijnaldum
	(52, 439, 'MED', 88), -- Wesley Sneijder
	(52, 441, 'DEL', 90), -- Robin van Persie
	(52, 442, 'DEL', 94), -- Arjen Robben
	-- Plantilla 53: Países Bajos 2010
	(53, 443, 'POR', 82), -- Maarten Stekelenburg
	(53, 444, 'DEF', 80), -- Gregory van der Wiel
	(53, 445, 'DEF', 80), -- John Heitinga
	(53, 446, 'DEF', 80), -- Joris Mathijsen
	(53, 447, 'DEF', 82), -- Giovanni van Bronckhorst
	(53, 448, 'MED', 82), -- Mark van Bommel
	(53, 438, 'MED', 80), -- Nigel de Jong
	(53, 439, 'MED', 92), -- Wesley Sneijder
	(53, 437, 'DEL', 82), -- Dirk Kuyt
	(53, 442, 'DEL', 91), -- Arjen Robben
	(53, 441, 'DEL', 86), -- Robin van Persie
	-- Plantilla 54: Países Bajos 1990
	(54, 449, 'POR', 84), -- Hans van Breukelen
	(54, 450, 'DEF', 80), -- Berry van Aerle
	(54, 451, 'DEF', 90), -- Frank Rijkaard
	(54, 452, 'DEF', 90), -- Ronald Koeman
	(54, 453, 'DEF', 78), -- Adri van Tiggelen
	(54, 454, 'MED', 80), -- Jan Wouters
	(54, 455, 'MED', 78), -- Erwin Koeman
	(54, 456, 'MED', 90), -- Ruud Gullit
	(54, 457, 'DEL', 76), -- Gerald Vanenburg
	(54, 458, 'DEL', 92), -- Marco van Basten
	(54, 459, 'DEL', 76), -- Wim Kieft
	-- Plantilla 55: Países Bajos 1974
	(55, 460, 'POR', 82), -- Jan Jongbloed
	(55, 461, 'DEF', 84), -- Wim Suurbier
	(55, 462, 'DEF', 82), -- Wim Rijsbergen
	(55, 463, 'DEF', 84), -- Arie Haan
	(55, 464, 'DEF', 88), -- Ruud Krol
	(55, 465, 'MED', 84), -- Wim Jansen
	(55, 466, 'MED', 90), -- Johan Neeskens
	(55, 467, 'MED', 86), -- Willem van Hanegem
	(55, 468, 'DEL', 86), -- Johnny Rep
	(55, 469, 'DEL', 95), -- Johan Cruyff
	(55, 470, 'DEL', 88), -- Rob Rensenbrink
	-- Plantilla 56: España 2026
	(56, 471, 'POR', 86), -- Unai Simón
	(56, 472, 'DEF', 82), -- Pedro Porro
	(56, 473, 'DEF', 84), -- Pau Cubarsí
	(56, 474, 'DEF', 82), -- Aymeric Laporte
	(56, 475, 'DEF', 82), -- Marc Cucurella
	(56, 476, 'MED', 91), -- Rodri
	(56, 477, 'MED', 84), -- Fabián Ruiz
	(56, 479, 'MED', 85), -- Dani Olmo
	(56, 478, 'DEL', 88), -- Lamine Yamal
	(56, 480, 'DEL', 80), -- Álex Baena
	(56, 481, 'DEL', 84), -- Mikel Oyarzabal
	-- Plantilla 57: España 2022
	(57, 471, 'POR', 84), -- Unai Simón
	(57, 482, 'DEF', 82), -- Marcos Llorente
	(57, 476, 'DEF', 84), -- Rodri
	(57, 474, 'DEF', 84), -- Aymeric Laporte
	(57, 483, 'DEF', 84), -- Jordi Alba
	(57, 484, 'MED', 84), -- Sergio Busquets
	(57, 485, 'MED', 82), -- Gavi
	(57, 486, 'MED', 86), -- Pedri
	(57, 487, 'DEL', 78), -- Pablo Sarabia
	(57, 488, 'DEL', 80), -- Álvaro Morata
	(57, 489, 'DEL', 80), -- Marco Asensio
	-- Plantilla 58: España 2014
	(58, 490, 'POR', 86), -- Iker Casillas
	(58, 491, 'DEF', 80), -- César Azpilicueta
	(58, 492, 'DEF', 86), -- Gerard Piqué
	(58, 493, 'DEF', 88), -- Sergio Ramos
	(58, 483, 'DEF', 84), -- Jordi Alba
	(58, 484, 'MED', 86), -- Sergio Busquets
	(58, 494, 'MED', 86), -- Xabi Alonso
	(58, 495, 'MED', 90), -- Andrés Iniesta
	(58, 496, 'DEL', 86), -- David Silva
	(58, 497, 'DEL', 82), -- Pedro Rodríguez
	(58, 498, 'DEL', 83), -- Diego Costa
	-- Plantilla 59: España 2010
	(59, 490, 'POR', 94), -- Iker Casillas
	(59, 493, 'DEF', 88), -- Sergio Ramos
	(59, 492, 'DEF', 88), -- Gerard Piqué
	(59, 499, 'DEF', 90), -- Carles Puyol
	(59, 500, 'DEF', 82), -- Joan Capdevila
	(59, 484, 'MED', 86), -- Sergio Busquets
	(59, 494, 'MED', 88), -- Xabi Alonso
	(59, 501, 'MED', 91), -- Xavi Hernández
	(59, 495, 'MED', 92), -- Andrés Iniesta
	(59, 497, 'DEL', 82), -- Pedro Rodríguez
	(59, 502, 'DEL', 90), -- David Villa
	-- Plantilla 60: España 1982
	(60, 503, 'POR', 85), -- Luis Arconada
	(60, 504, 'DEF', 76), -- Alberto Urquiaga
	(60, 505, 'DEF', 76), -- Luis Alesanco
	(60, 506, 'DEF', 76), -- Miguel Tendillo
	(60, 507, 'DEF', 82), -- José Antonio Camacho
	(60, 508, 'MED', 78), -- Periko Alonso
	(60, 509, 'MED', 78), -- Jesús Zamora
	(60, 510, 'MED', 84), -- Rafael Gordillo
	(60, 511, 'DEL', 82), -- Juanito
	(60, 512, 'DEL', 82), -- Santillana
	(60, 513, 'DEL', 74), -- Jesús Satrústegui
	-- Plantilla 61: Inglaterra 2026
	(61, 514, 'POR', 84), -- Jordan Pickford
	(61, 515, 'DEF', 84), -- Reece James
	(61, 516, 'DEF', 85), -- John Stones
	(61, 517, 'DEF', 84), -- Marc Guéhi
	(61, 518, 'DEF', 76), -- Djed Spence
	(61, 519, 'MED', 87), -- Declan Rice
	(61, 520, 'MED', 80), -- Elliot Anderson
	(61, 521, 'MED', 90), -- Jude Bellingham
	(61, 522, 'MED', 82), -- Morgan Rogers
	(61, 523, 'DEL', 91), -- Harry Kane
	(61, 524, 'DEL', 80), -- Anthony Gordon
	-- Plantilla 62: Inglaterra 2022
	(62, 514, 'POR', 83), -- Jordan Pickford
	(62, 525, 'DEF', 84), -- Kyle Walker
	(62, 516, 'DEF', 84), -- John Stones
	(62, 526, 'DEF', 82), -- Harry Maguire
	(62, 527, 'DEF', 82), -- Luke Shaw
	(62, 519, 'MED', 83), -- Declan Rice
	(62, 528, 'MED', 80), -- Jordan Henderson
	(62, 521, 'MED', 85), -- Jude Bellingham
	(62, 529, 'DEL', 86), -- Bukayo Saka
	(62, 523, 'DEL', 90), -- Harry Kane
	(62, 530, 'DEL', 85), -- Phil Foden
	-- Plantilla 63: Inglaterra 2018
	(63, 514, 'POR', 80), -- Jordan Pickford
	(63, 525, 'DEF', 82), -- Kyle Walker
	(63, 516, 'DEF', 80), -- John Stones
	(63, 526, 'DEF', 80), -- Harry Maguire
	(63, 531, 'DEF', 82), -- Kieran Trippier
	(63, 532, 'DEF', 76), -- Ashley Young
	(63, 528, 'MED', 80), -- Jordan Henderson
	(63, 534, 'MED', 80), -- Dele Alli
	(63, 533, 'MED', 80), -- Jesse Lingard
	(63, 535, 'DEL', 82), -- Raheem Sterling
	(63, 523, 'DEL', 88), -- Harry Kane
	-- Plantilla 64: Inglaterra 2010
	(64, 536, 'POR', 78), -- David James
	(64, 537, 'DEF', 80), -- Glen Johnson
	(64, 538, 'DEF', 86), -- John Terry
	(64, 539, 'DEF', 78), -- Matthew Upson
	(64, 540, 'DEF', 86), -- Ashley Cole
	(64, 541, 'MED', 78), -- Aaron Lennon
	(64, 542, 'MED', 88), -- Frank Lampard
	(64, 543, 'MED', 80), -- Gareth Barry
	(64, 544, 'MED', 90), -- Steven Gerrard
	(64, 545, 'DEL', 88), -- Wayne Rooney
	(64, 546, 'DEL', 78), -- Jermain Defoe
	-- Plantilla 65: Inglaterra 1998
	(65, 547, 'POR', 86), -- David Seaman
	(65, 548, 'DEF', 80), -- Gary Neville
	(65, 549, 'DEF', 85), -- Tony Adams
	(65, 550, 'DEF', 84), -- Sol Campbell
	(65, 551, 'DEF', 80), -- Graeme Le Saux
	(65, 552, 'MED', 88), -- David Beckham
	(65, 553, 'MED', 84), -- Paul Ince
	(65, 554, 'MED', 86), -- Paul Scholes
	(65, 555, 'MED', 80), -- Darren Anderton
	(65, 556, 'DEL', 90), -- Michael Owen
	(65, 557, 'DEL', 90), -- Alan Shearer
	-- Plantilla 66: Inglaterra 1966
	(66, 558, 'POR', 92), -- Gordon Banks
	(66, 559, 'DEF', 82), -- George Cohen
	(66, 560, 'DEF', 82), -- Ray Wilson
	(66, 562, 'DEF', 84), -- Jack Charlton
	(66, 561, 'DEF', 92), -- Bobby Moore
	(66, 563, 'MED', 80), -- Nobby Stiles
	(66, 564, 'MED', 92), -- Bobby Charlton
	(66, 565, 'MED', 86), -- Alan Ball
	(66, 566, 'MED', 85), -- Martin Peters
	(66, 567, 'DEL', 88), -- Geoff Hurst
	(66, 568, 'DEL', 82), -- Roger Hunt
	-- Plantilla 67: Portugal 2026
	(67, 569, 'POR', 86), -- Diogo Costa
	(67, 570, 'DEF', 83), -- João Cancelo
	(67, 571, 'DEF', 88), -- Rúben Dias
	(67, 572, 'DEF', 78), -- Renato Veiga
	(67, 573, 'DEF', 85), -- Nuno Mendes
	(67, 574, 'MED', 84), -- João Neves
	(67, 575, 'MED', 86), -- Vitinha
	(67, 577, 'MED', 87), -- Bruno Fernandes
	(67, 576, 'DEL', 80), -- Pedro Neto
	(67, 578, 'DEL', 82), -- João Félix
	(67, 579, 'DEL', 85), -- Cristiano Ronaldo
	-- Plantilla 68: Portugal 2018
	(68, 580, 'POR', 82), -- Rui Patrício
	(68, 581, 'DEF', 76), -- Cédric Soares
	(68, 582, 'DEF', 84), -- Pepe
	(68, 583, 'DEF', 76), -- José Fonte
	(68, 584, 'DEF', 80), -- Raphaël Guerreiro
	(68, 585, 'MED', 78), -- William Carvalho
	(68, 586, 'MED', 82), -- João Moutinho
	(68, 587, 'MED', 84), -- Bernardo Silva
	(68, 588, 'DEL', 74), -- Gelson Martins
	(68, 589, 'DEL', 78), -- Gonçalo Guedes
	(68, 579, 'DEL', 92), -- Cristiano Ronaldo
	-- Plantilla 69: Portugal 2014
	(69, 590, 'POR', 76), -- Beto
	(69, 591, 'DEF', 74), -- João Pereira
	(69, 582, 'DEF', 84), -- Pepe
	(69, 592, 'DEF', 80), -- Bruno Alves
	(69, 593, 'DEF', 74), -- Ricardo Costa
	(69, 594, 'DEF', 82), -- Fábio Coentrão
	(69, 595, 'MED', 78), -- Raul Meireles
	(69, 596, 'MED', 74), -- Miguel Veloso
	(69, 597, 'DEL', 82), -- Nani
	(69, 598, 'DEL', 72), -- Hélder Postiga
	(69, 579, 'DEL', 93), -- Cristiano Ronaldo
	-- Plantilla 70: Portugal 2006
	(70, 599, 'POR', 80), -- Ricardo Pereira
	(70, 600, 'DEF', 80), -- Paulo Ferreira
	(70, 601, 'DEF', 86), -- Ricardo Carvalho
	(70, 602, 'DEF', 78), -- Fernando Meira
	(70, 603, 'DEF', 78), -- Nuno Valente
	(70, 604, 'MED', 78), -- Costinha
	(70, 605, 'MED', 84), -- Maniche
	(70, 606, 'MED', 88), -- Deco
	(70, 607, 'DEL', 88), -- Luís Figo
	(70, 608, 'DEL', 84), -- Pauleta
	(70, 579, 'DEL', 88), -- Cristiano Ronaldo
	-- Plantilla 71: Portugal 2002
	(71, 609, 'POR', 84), -- Vítor Baía
	(71, 610, 'DEF', 78), -- Abel Xavier
	(71, 611, 'DEF', 80), -- Jorge Costa
	(71, 612, 'DEF', 82), -- Fernando Couto
	(71, 613, 'DEF', 78), -- Rui Jorge
	(71, 614, 'MED', 82), -- Paulo Sousa
	(71, 615, 'MED', 82), -- Sérgio Conceição
	(71, 616, 'MED', 88), -- Rui Costa
	(71, 617, 'DEL', 80), -- João Vieira Pinto
	(71, 607, 'DEL', 92), -- Luís Figo
	(71, 608, 'DEL', 84), -- Pauleta
	-- Plantilla 72: Portugal 1966
	(72, 618, 'POR', 82), -- José Pereira
	(72, 619, 'DEF', 76), -- Alberto Festa
	(72, 620, 'DEF', 76), -- Alexandre Baptista
	(72, 621, 'DEF', 78), -- Vicente Lucas
	(72, 622, 'DEF', 78), -- Hilário
	(72, 623, 'MED', 80), -- Jaime Graça
	(72, 624, 'MED', 88), -- Mário Coluna
	(72, 625, 'DEL', 84), -- José Augusto
	(72, 626, 'DEL', 86), -- José Torres
	(72, 627, 'DEL', 96), -- Eusébio
	(72, 628, 'DEL', 82), -- António Simões
	-- Plantilla 73: Hungría 1986
	(73, 629, 'POR', 76), -- Péter Disztl
	(73, 630, 'DEF', 74), -- Sándor Sallai
	(73, 631, 'DEF', 74), -- Imre Garaba
	(73, 632, 'DEF', 72), -- József Kardos
	(73, 633, 'DEF', 72), -- Antal Róth
	(73, 634, 'MED', 84), -- Lajos Détári
	(73, 635, 'MED', 74), -- Márton Esterházy
	(73, 636, 'MED', 72), -- Gyula Burcsa
	(73, 637, 'MED', 74), -- György Bognár
	(73, 638, 'DEL', 76), -- József Kiprich
	(73, 639, 'DEL', 72), -- Zoltán Péter
	-- Plantilla 74: Hungría 1954
	(74, 640, 'POR', 88), -- Gyula Grosics
	(74, 641, 'DEF', 82), -- Jenő Buzánszky
	(74, 642, 'DEF', 86), -- Gyula Lóránt
	(74, 643, 'DEF', 82), -- Mihály Lantos
	(74, 644, 'MED', 90), -- József Bozsik
	(74, 645, 'MED', 84), -- József Zakariás
	(74, 648, 'MED', 92), -- Nándor Hidegkuti
	(74, 646, 'DEL', 86), -- Zoltán Czibor
	(74, 647, 'DEL', 94), -- Sándor Kocsis
	(74, 649, 'DEL', 98), -- Ferenc Puskás
	(74, 650, 'DEL', 78), -- Mihály Tóth
	-- Plantilla 75: México 2022
	(75, 651, 'POR', 84), -- Guillermo Ochoa
	(75, 652, 'DEF', 72), -- Jorge Sánchez
	(75, 653, 'DEF', 76), -- César Montes
	(75, 654, 'DEF', 76), -- Héctor Moreno
	(75, 655, 'DEF', 74), -- Jesús Gallardo
	(75, 656, 'MED', 80), -- Edson Álvarez
	(75, 657, 'MED', 78), -- Héctor Herrera
	(75, 658, 'MED', 76), -- Andrés Guardado
	(75, 659, 'DEL', 80), -- Hirving Lozano
	(75, 660, 'DEL', 74), -- Henry Martín
	(75, 661, 'DEL', 74), -- Alexis Vega
	-- Plantilla 76: México 1986
	(76, 662, 'POR', 78), -- Pablo Larios
	(76, 663, 'DEF', 76), -- Rafael Amador
	(76, 664, 'DEF', 78), -- Fernando Quirarte
	(76, 665, 'DEF', 76), -- Carlos de los Cobos
	(76, 666, 'DEF', 72), -- Raúl Servín
	(76, 667, 'MED', 76), -- Javier Aguirre
	(76, 668, 'MED', 76), -- Tomás Boy
	(76, 669, 'MED', 82), -- Manuel Negrete
	(76, 670, 'MED', 74), -- Miguel España
	(76, 671, 'DEL', 76), -- Luis Flores
	(76, 672, 'DEL', 90), -- Hugo Sánchez
	-- Plantilla 77: Polonia 2022
	(77, 673, 'POR', 85), -- Wojciech Szczęsny
	(77, 674, 'DEF', 76), -- Matty Cash
	(77, 675, 'DEF', 74), -- Kamil Glik
	(77, 676, 'DEF', 74), -- Jan Bednarek
	(77, 677, 'DEF', 72), -- Bartosz Bereszyński
	(77, 678, 'MED', 82), -- Piotr Zieliński
	(77, 679, 'MED', 74), -- Krzysztof Krychowiak
	(77, 680, 'MED', 74), -- Przemysław Frankowski
	(77, 681, 'MED', 70), -- Nicola Zalewski
	(77, 682, 'DEL', 90), -- Robert Lewandowski
	(77, 683, 'DEL', 76), -- Arkadiusz Milik
	-- Plantilla 78: Polonia 1982
	(78, 684, 'POR', 80), -- Józef Młynarczyk
	(78, 685, 'DEF', 74), -- Paweł Janas
	(78, 686, 'DEF', 82), -- Władysław Żmuda
	(78, 687, 'DEF', 76), -- Antoni Szymanowski
	(78, 688, 'DEF', 72), -- Marek Dziuba
	(78, 689, 'MED', 76), -- Andrzej Buncol
	(78, 690, 'MED', 78), -- Janusz Kupcewicz
	(78, 691, 'MED', 90), -- Zbigniew Boniek
	(78, 692, 'DEL', 80), -- Włodzimierz Smolarek
	(78, 693, 'DEL', 80), -- Grzegorz Lato
	(78, 694, 'DEL', 78), -- Andrzej Szarmach
	-- Plantilla 79: República Checa 2006
	(79, 695, 'POR', 90), -- Petr Čech
	(79, 696, 'DEF', 78), -- Zdeněk Grygera
	(79, 697, 'DEF', 80), -- Tomáš Ujfaluši
	(79, 698, 'DEF', 80), -- Marek Jankulovski
	(79, 699, 'MED', 76), -- Tomáš Galásek
	(79, 700, 'MED', 76), -- Jan Polák
	(79, 701, 'MED', 90), -- Pavel Nedvěd
	(79, 702, 'MED', 84), -- Tomáš Rosický
	(79, 703, 'MED', 76), -- Jaroslav Plašil
	(79, 704, 'DEL', 82), -- Jan Koller
	(79, 705, 'DEL', 84), -- Milan Baroš
	-- Plantilla 80: República Checa 1962
	(80, 706, 'POR', 88), -- Viliam Schrojf
	(80, 707, 'DEF', 78), -- Jiří Tichý
	(80, 708, 'DEF', 80), -- Ladislav Novák
	(80, 709, 'DEF', 80), -- Svatopluk Pluskal
	(80, 710, 'DEF', 80), -- Ján Popluhár
	(80, 711, 'MED', 90), -- Josef Masopust
	(80, 712, 'MED', 80), -- Andrej Kvašňák
	(80, 715, 'MED', 76), -- Josef Jelínek
	(80, 713, 'DEL', 80), -- Adolf Scherer
	(80, 714, 'DEL', 76), -- Josef Kadraba
	(80, 716, 'DEL', 76), -- Jozef Adamec
	-- Plantilla 81: Colombia 2014
	(81, 717, 'POR', 84), -- David Ospina
	(81, 718, 'DEF', 78), -- Camilo Zúñiga
	(81, 719, 'DEF', 78), -- Cristián Zapata
	(81, 720, 'DEF', 78), -- Mario Yepes
	(81, 721, 'DEF', 76), -- Pablo Armero
	(81, 722, 'MED', 78), -- Carlos Sánchez
	(81, 723, 'MED', 74), -- Abel Aguilar
	(81, 724, 'MED', 82), -- Juan Cuadrado
	(81, 725, 'MED', 90), -- James Rodríguez
	(81, 726, 'DEL', 76), -- Teófilo Gutiérrez
	(81, 727, 'DEL', 80), -- Jackson Martínez
	-- Plantilla 82: Colombia 1994
	(82, 728, 'POR', 82), -- Óscar Córdoba
	(82, 729, 'DEF', 76), -- Luis Herrera
	(82, 730, 'DEF', 78), -- Luis Perea
	(82, 731, 'DEF', 82), -- Andrés Escobar
	(82, 732, 'MED', 76), -- Wilson Pérez
	(82, 733, 'MED', 90), -- Carlos Valderrama
	(82, 734, 'MED', 78), -- Leonel Álvarez
	(82, 735, 'MED', 84), -- Freddy Rincón
	(82, 736, 'MED', 76), -- Gabriel Gómez
	(82, 737, 'DEL', 80), -- Adolfo Valencia
	(82, 738, 'DEL', 86), -- Faustino Asprilla
	-- Plantilla 83: Corea del Sur 2018
	(83, 739, 'POR', 80), -- Cho Hyun-woo
	(83, 740, 'DEF', 72), -- Lee Yong
	(83, 741, 'DEF', 74), -- Kim Young-gwon
	(83, 742, 'DEF', 74), -- Jang Hyun-soo
	(83, 743, 'DEF', 72), -- Hong Chul
	(83, 744, 'MED', 78), -- Ki Sung-yueng
	(83, 745, 'MED', 74), -- Koo Ja-cheol
	(83, 746, 'MED', 74), -- Lee Jae-sung
	(83, 747, 'DEL', 76), -- Hwang Hee-chan
	(83, 748, 'DEL', 88), -- Son Heung-min
	(83, 749, 'DEL', 70), -- Kim Shin-wook
	-- Plantilla 84: Corea del Sur 2002
	(84, 750, 'POR', 82), -- Lee Woon-jae
	(84, 751, 'DEF', 76), -- Choi Jin-cheul
	(84, 752, 'DEF', 86), -- Hong Myung-bo
	(84, 753, 'DEF', 78), -- Kim Tae-young
	(84, 758, 'DEF', 78), -- Song Chong-gug
	(84, 754, 'MED', 80), -- Lee Young-pyo
	(84, 755, 'MED', 78), -- Yoo Sang-chul
	(84, 756, 'MED', 76), -- Kim Nam-il
	(84, 757, 'MED', 80), -- Park Ji-sung
	(84, 759, 'DEL', 80), -- Ahn Jung-hwan
	(84, 760, 'DEL', 76), -- Seol Ki-hyeon
	-- Plantilla 85: Costa de Marfil 2014
	(85, 761, 'POR', 74), -- Boubacar Barry
	(85, 762, 'DEF', 78), -- Serge Aurier
	(85, 763, 'DEF', 76), -- Kolo Touré
	(85, 764, 'DEF', 74), -- Sol Bamba
	(85, 765, 'DEF', 74), -- Arthur Boka
	(85, 766, 'MED', 90), -- Yaya Touré
	(85, 767, 'MED', 78), -- Cheick Tioté
	(85, 768, 'MED', 80), -- Gervinho
	(85, 771, 'MED', 76), -- Salomon Kalou
	(85, 769, 'DEL', 78), -- Wilfried Bony
	(85, 770, 'DEL', 84), -- Didier Drogba
	-- Plantilla 86: Costa de Marfil 2006
	(86, 772, 'POR', 74), -- Jean-Jacques Tizié
	(86, 773, 'DEF', 76), -- Emmanuel Eboué
	(86, 763, 'DEF', 80), -- Kolo Touré
	(86, 775, 'DEF', 76), -- Abdoulaye Méïté
	(86, 774, 'DEF', 74), -- Blaise Kouassi
	(86, 776, 'MED', 78), -- Didier Zokora
	(86, 777, 'MED', 74), -- Gilles Yapi Yapo
	(86, 778, 'MED', 76), -- Bonaventure Kalou
	(86, 766, 'MED', 80), -- Yaya Touré
	(86, 779, 'DEL', 78), -- Aruna Dindane
	(86, 770, 'DEL', 88), -- Didier Drogba
	-- Plantilla 87: Bulgaria 1998
	(87, 780, 'POR', 76), -- Zdravko Zdravkov
	(87, 781, 'DEF', 72), -- Radostin Kishishev
	(87, 782, 'DEF', 78), -- Trifon Ivanov
	(87, 783, 'DEF', 72), -- Ivaylo Petkov
	(87, 784, 'DEF', 74), -- Zlatko Yankov
	(87, 785, 'MED', 84), -- Krasimir Balakov
	(87, 786, 'MED', 72), -- Georgi Bachev
	(87, 787, 'MED', 78), -- Ivaylo Yordanov
	(87, 788, 'DEL', 85), -- Hristo Stoichkov
	(87, 789, 'DEL', 78), -- Luboslav Penev
	(87, 790, 'DEL', 72), -- Stoyko Sakaliev
	-- Plantilla 88: Bulgaria 1994
	(88, 791, 'POR', 82), -- Borislav Mihaylov
	(88, 792, 'DEF', 78), -- Emil Kremenliev
	(88, 782, 'DEF', 82), -- Trifon Ivanov
	(88, 793, 'DEF', 78), -- Petar Hubchev
	(88, 794, 'DEF', 78), -- Iliyan Kiriakov
	(88, 784, 'DEF', 78), -- Zlatko Yankov
	(88, 795, 'MED', 84), -- Yordan Lechkov
	(88, 785, 'MED', 86), -- Krasimir Balakov
	(88, 796, 'MED', 76), -- Daniel Borimirov
	(88, 797, 'DEL', 84), -- Emil Kostadinov
	(88, 788, 'DEL', 94), -- Hristo Stoichkov
	-- Plantilla 89: Gales 2022
	(89, 798, 'POR', 76), -- Wayne Hennessey
	(89, 799, 'DEF', 74), -- Connor Roberts
	(89, 800, 'DEF', 74), -- Joe Rodon
	(89, 801, 'DEF', 76), -- Ben Davies
	(89, 802, 'DEF', 74), -- Neco Williams
	(89, 803, 'MED', 76), -- Ethan Ampadu
	(89, 804, 'MED', 76), -- Joe Allen
	(89, 805, 'MED', 76), -- Aaron Ramsey
	(89, 806, 'DEL', 76), -- Harry Wilson
	(89, 807, 'DEL', 74), -- Kieffer Moore
	(89, 808, 'DEL', 85), -- Gareth Bale
	-- Plantilla 90: Gales 1958
	(90, 809, 'POR', 84), -- Jack Kelsey
	(90, 810, 'DEF', 76), -- Stuart Williams
	(90, 811, 'DEF', 76), -- Mel Hopkins
	(90, 812, 'DEF', 74), -- Dave Bowen
	(90, 813, 'DEF', 82), -- Mel Charles
	(90, 814, 'MED', 74), -- Derek Sullivan
	(90, 816, 'MED', 88), -- Ivor Allchurch
	(90, 815, 'DEL', 84), -- Cliff Jones
	(90, 817, 'DEL', 76), -- Terry Medwin
	(90, 818, 'DEL', 74), -- Colin Webster
	(90, 819, 'DEL', 94), -- John Charles
	-- Plantilla 91: Chile 1982
	(91, 820, 'POR', 74), -- Mario Osben
	(91, 821, 'DEF', 78), -- Mario Soto
	(91, 822, 'DEF', 88), -- Elías Figueroa
	(91, 823, 'DEF', 74), -- René Valenzuela
	(91, 824, 'DEF', 70), -- Rodolfo Dubó
	(91, 825, 'MED', 72), -- Eduardo Bonvallet
	(91, 826, 'MED', 72), -- Manuel Rojas
	(91, 827, 'MED', 74), -- Miguel Ángel Neira
	(91, 828, 'DEL', 74), -- Patricio Yáñez
	(91, 829, 'DEL', 76), -- Juan Carlos Letelier
	(91, 830, 'DEL', 86), -- Carlos Caszely
	-- Plantilla 92: Chile 1962
	(92, 831, 'POR', 80), -- Misael Escuti
	(92, 832, 'DEF', 78), -- Luis Eyzaguirre
	(92, 833, 'DEF', 76), -- Carlos Contreras
	(92, 834, 'DEF', 76), -- Raúl Sánchez
	(92, 835, 'DEF', 74), -- Sergio Navarro
	(92, 836, 'MED', 82), -- Jorge Toro
	(92, 837, 'MED', 78), -- Eladio Rojas
	(92, 838, 'DEL', 88), -- Leonel Sánchez
	(92, 839, 'DEL', 76), -- Jaime Ramírez
	(92, 840, 'DEL', 76), -- Alberto Fouilloux
	(92, 841, 'DEL', 74), -- Armando Tobar
	-- Plantilla 93: Dinamarca 2022
	(93, 842, 'POR', 80), -- Kasper Schmeichel
	(93, 843, 'DEF', 76), -- Joakim Mæhle
	(93, 844, 'DEF', 80), -- Andreas Christensen
	(93, 845, 'DEF', 78), -- Simon Kjær
	(93, 846, 'DEF', 78), -- Joachim Andersen
	(93, 847, 'DEF', 74), -- Rasmus Kristensen
	(93, 848, 'MED', 78), -- Thomas Delaney
	(93, 849, 'MED', 82), -- Pierre-Emile Højbjerg
	(93, 850, 'MED', 86), -- Christian Eriksen
	(93, 851, 'DEL', 74), -- Andreas Skov Olsen
	(93, 852, 'DEL', 74), -- Kasper Dolberg
	-- Plantilla 94: Dinamarca 1998
	(94, 853, 'POR', 90), -- Peter Schmeichel
	(94, 854, 'DEF', 76), -- Michael Schjønberg
	(94, 855, 'DEF', 80), -- Marc Rieper
	(94, 856, 'DEF', 78), -- Jes Høgh
	(94, 857, 'DEF', 74), -- Søren Colding
	(94, 858, 'DEF', 76), -- Thomas Helveg
	(94, 859, 'MED', 78), -- Allan Nielsen
	(94, 860, 'MED', 76), -- Morten Wieghorst
	(94, 862, 'MED', 90), -- Michael Laudrup
	(94, 861, 'DEL', 86), -- Brian Laudrup
	(94, 863, 'DEL', 80), -- Ebbe Sand
	-- Plantilla 95: Noruega 1998
	(95, 864, 'POR', 74), -- Frode Grodås
	(95, 865, 'DEF', 76), -- Vegard Heggem
	(95, 866, 'DEF', 78), -- Henning Berg
	(95, 867, 'DEF', 76), -- Dan Eggen
	(95, 868, 'DEF', 78), -- Stig Inge Bjørnebye
	(95, 869, 'MED', 74), -- Erik Mykland
	(95, 870, 'MED', 80), -- Øyvind Leonhardsen
	(95, 871, 'MED', 78), -- Kjetil Rekdal
	(95, 872, 'DEL', 80), -- Tore André Flo
	(95, 873, 'DEL', 82), -- Ole Gunnar Solskjær
	(95, 874, 'DEL', 76), -- Håvard Flo
	-- Plantilla 96: Noruega 1994
	(96, 875, 'POR', 80), -- Erik Thorstvedt
	(96, 866, 'DEF', 78), -- Henning Berg
	(96, 876, 'DEF', 80), -- Rune Bratseth
	(96, 877, 'DEF', 76), -- Gunnar Halle
	(96, 868, 'DEF', 76), -- Stig Inge Bjørnebye
	(96, 878, 'MED', 78), -- Lars Bohinen
	(96, 869, 'MED', 72), -- Erik Mykland
	(96, 870, 'MED', 74), -- Øyvind Leonhardsen
	(96, 871, 'MED', 74), -- Kjetil Rekdal
	(96, 879, 'DEL', 78), -- Jan Åge Fjørtoft
	(96, 880, 'DEL', 72), -- Jahn Ivar Jakobsen
	-- Plantilla 97: Japón 2022
	(97, 881, 'POR', 74), -- Shuichi Gonda
	(97, 882, 'DEF', 76), -- Hiroki Sakai
	(97, 883, 'DEF', 78), -- Maya Yoshida
	(97, 884, 'DEF', 76), -- Ko Itakura
	(97, 885, 'DEF', 74), -- Yuto Nagatomo
	(97, 886, 'MED', 80), -- Wataru Endo
	(97, 887, 'MED', 76), -- Hidemasa Morita
	(97, 889, 'MED', 80), -- Daichi Kamada
	(97, 888, 'DEL', 82), -- Kaoru Mitoma
	(97, 890, 'DEL', 78), -- Junya Ito
	(97, 891, 'DEL', 76), -- Daizen Maeda
	-- Plantilla 98: Japón 2014
	(98, 892, 'POR', 76), -- Eiji Kawashima
	(98, 893, 'DEF', 76), -- Atsuto Uchida
	(98, 883, 'DEF', 76), -- Maya Yoshida
	(98, 894, 'DEF', 74), -- Masato Morishige
	(98, 885, 'DEF', 76), -- Yuto Nagatomo
	(98, 895, 'MED', 78), -- Makoto Hasebe
	(98, 896, 'MED', 78), -- Yasuhito Endo
	(98, 897, 'MED', 82), -- Keisuke Honda
	(98, 898, 'MED', 82), -- Shinji Kagawa
	(98, 899, 'DEL', 78), -- Shinji Okazaki
	(98, 900, 'DEL', 74); -- Yuya Osako
