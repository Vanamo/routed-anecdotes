import React from 'react'
import {
  BrowserRouter as Router,
  Route, Link, NavLink, Redirect
} from 'react-router-dom'
import {
  Container,
  Table, Form, Button,
  Message, Menu, Grid, Image
} from 'semantic-ui-react'

const NavigationMenu = () => (
  <Menu inverted>
    <Menu.Item link>
      <NavLink exact to='/' activeStyle={linkStyle}>anecdotes</NavLink>
    </Menu.Item>
    <Menu.Item link>
      <NavLink exact to='/create' activeStyle={linkStyle}>create new</NavLink>
    </Menu.Item>
    <Menu.Item>
      <NavLink exact to='/about' activeStyle={linkStyle}>about</NavLink>
    </Menu.Item>
  </Menu>
)

const linkStyle = {
  fontStyle: 'italic'
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <Table striped celled>
      <Table.Body>
        {anecdotes.map(a =>
          <Table.Row key={a.id}>
            <Table.Cell>
              <Link to={`/anecdotes/${a.id}`}>{a.content}</Link>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </div>
)

const Anecdote = ({ anecdote }) => (
  <div>
    <h2>{anecdote.content}</h2>
    <div>has {anecdote.votes} votes</div>
    <p></p>
    <div>
      for more info see <a href={anecdote.info}>{anecdote.info}</a>
    </div>
    <p></p>
  </div>
)

const About = () => (
  <Grid>
    <Grid.Row>
      <Grid.Column width={16}>
        <h2>About anecdote app</h2>
      </Grid.Column>
    </Grid.Row>

    <Grid.Row>
      <Grid.Column width={8}>
        <p>According to Wikipedia:</p>

        <em>An anecdote is a brief, revealing account of an individual person or an incident.
          Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
          such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
        An anecdote is "a story with a point."</em>
        <p></p>
        <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
      </Grid.Column>
      <Grid.Column width={8}>
        <Image src='https://upload.wikimedia.org/wikipedia/commons/d/d9/Edsger_Wybe_Dijkstra.jpg'
          style={imageStyle} />
      </Grid.Column>
    </Grid.Row>
  </Grid>
)
    
const imageStyle = {
      width: 180,
    height: 240
  }
  
  const Footer = () => (
  <div style={footerStyle}>
      Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.
  
    See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code.
  </div>
    )
    
const footerStyle = {
      paddingTop: 20
  }
  
const Notification = ({message}) => {
  if (message === null) {
      return null
}
return (
      <Message success>
      {message}
    </Message>
    )
  }
  
class CreateNew extends React.Component {
      constructor() {
    super()
    this.state = {
      content: '',
    author: '',
    info: ''
  }
}

  handleChange = (e) => {
      console.log(e.target.name, e.target.value)
    this.setState({[e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
      e.preventDefault()
    this.props.addNew({
      content: this.state.content,
    author: this.state.author,
    info: this.state.info,
    votes: 0
  })
    this.setState({
      content: '',
    author: '',
    info: ''
  })
  this.props.history.push('/')
}

  render() {
    return (
      <div>
      <h2>create a new anecdote</h2>
      <Form onSubmit={this.handleSubmit}>
        <Form.Field>
          <label>content</label>
          <input name='content' value={this.state.content} onChange={this.handleChange} />
        </Form.Field>
        <Form.Field>
          <label>author</label>
          <input name='author' value={this.state.author} onChange={this.handleChange} />
        </Form.Field>
        <Form.Field>
          <label>url for more info</label>
          <input name='info' value={this.state.info} onChange={this.handleChange} />
        </Form.Field>
        <Button type='submit'>create</Button>
      </Form>
    </div>
    )

  }
}

class App extends React.Component {
      constructor() {
    super()

    this.state = {
      anecdotes: [
        {
      content: 'If it hurts, do it more often',
    author: 'Jez Humble',
    info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
    votes: 0,
    id: '1'
  },
        {
      content: 'Premature optimization is the root of all evil',
    author: 'Donald Knuth',
    info: 'http://wiki.c2.com/?PrematureOptimization',
    votes: 0,
    id: '2'
  }
],
notification: null
}
}

  addNew = (anecdote) => {
      anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({
      anecdotes: this.state.anecdotes.concat(anecdote),
      notification: `a new anecdote '${anecdote.content}' created`
  })
    setTimeout(() => {
      this.setState({
        notification: null
      })
    }, 10000)
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
    votes: anecdote.votes + 1
  }

  const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({anecdotes})
  }

  render() {
    return (
      <Container>
      <div>
        <div>
          <h1>Software anecdotes</h1>
        </div>

        < Router >
          <div>
            <NavigationMenu />
            <p></p>
            <Notification message={this.state.notification} />

            <Route exact path="/" render={() =>
              <AnecdoteList anecdotes={this.state.anecdotes} />} />
            <Route exact path="/create" render={({ history }) =>
              <CreateNew addNew={this.addNew} history={history} />} />
            <Route exact path="/about" render={() => <About />} />
            <Route exact path="/anecdotes/:id" render={({ match }) =>
              <Anecdote anecdote={this.anecdoteById(match.params.id)} />}
            />
          </div>
        </Router >
        <div>
          <Footer />
        </div>
      </div>
    </Container>
    )
  }
}

export default App;
