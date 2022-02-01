import UU5 from "uu5g04";
import SubjectMan from "subject_man_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`SubjectMan.MaterialCard`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<SubjectMan.MaterialCard />);
    expect(wrapper).toMatchSnapshot();
  });
});
