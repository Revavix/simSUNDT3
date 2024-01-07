import TreeNode from '../models/tree/TreeNode'
import Defect from './Defect'
import Method from './Method'
import Receiver from './Receiver'
import Transmitter from './Transmitter'

const Root = new TreeNode("Root", false, null)
Root.AddChild(Method)
Root.AddChild(Transmitter)
Root.AddChild(Receiver)
Root.AddChild(Defect)

export default Root