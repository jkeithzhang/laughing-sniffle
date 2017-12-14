class People extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			contacts: []
		};
	}

	componentDidMount() {
		const contactsDate = localStorage.getItem('contactsDate') && new Date(parseInt(localStorage.getItem('contactsDate')))
		const now = new Date();
		const age = Math.round((now - contactsDate)/(1000*60));

		const oldFlag = age>=1;

		if(oldFlag) {
			this.fetchData();
		} else {
			console.log(`use local storage that are ${age} minutes old`);
		}
	}

	componentWillUnmount() {

	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem('contacts', JSON.stringify(nextState.contacts));
		localStorage.setItem('contactsDate', Date.now());
	}

	componentWillMount() {
		localStorage.getItem('contacts') && this.setState({
			contacts: JSON.parse(localStorage.getItem('contacts')),
			isLoading: false
		})
	}

	fetchData() {
		this.setState({
			isLoading: true,
			contacts: []
		})

		fetch('https://randomuser.me/api/?results=30')
		.then(response=>response.json())
		.then(parsedJSON=>parsedJSON.results.map(user=>(
				{
					name:`${user.name.first} ${user.name.last}`,
					username: `${user.login.username}`,
					email: `${user.email}`,
					location: `${user.location.street}, ${user.location.city}`,
					pic: `${user.picture.medium}`,
					tel: `${user.phone}`

				}
			)))
		.then(contacts=>this.setState({
			contacts,
			isLoading: false
		}))
		.catch(error=>console.log('parsing failed', error))
	}

	render() {
		const {isLoading, contacts} = this.state;
		return(
			<div className={`content row ${isLoading? 'is-loading' : ''}`}>
				{
					!isLoading && contacts.length>0 ? contacts.map(contact=> {
						return 	<div className="name-card col-md-2 row">
									<div className="col-md-4">
										<img src={contact.pic}/>
									</div>
									<div className="col-md-8">
										<span>
											<p>{contact.name}</p>
											<p>{contact.email}</p>
											<p>{contact.tel}</p>
										</span>
										<p>{contact.location.street} {contact.location.city}</p>
									</div>
								</div>
					}) : null
				}
				<div className="loader">
					<p>Content loading...</p>
				</div>
			</div>
		)
	}

}
class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {date: new Date()}
		//this.timerID = null;
	}

	componentDidMount() {
		this.timerID = setInterval(
			()=>this.tick(),
			1000
		)
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	tick() {
		this.setState({
			date: new Date()
		});
	}

	render() {
		return(
			<div>
				<h4>It is {this.state.date.toLocaleTimeString()}.</h4>
			</div>
		)
	}
}

ReactDOM.render(
	<Clock/>,
	document.getElementById('clock')
);
ReactDOM.render(
	<People/>,
	document.getElementById('app')
);
