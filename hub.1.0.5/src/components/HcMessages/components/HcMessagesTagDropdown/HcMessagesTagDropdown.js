
// ----- IMPORTS

import * as React from 'react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

// ----- COMPONENT

export default class HcMessagesTagDropdown extends React.Component {
	returnTagDropdownOptions() {
		const tagsArray = this.props.tagsArray.map(tagObject => ({
			key: tagObject.camlName,
			text: tagObject.name,
		}));
		tagsArray.unshift({ key: '', text: '' });
		return tagsArray;
	}

	render() {
		return (
			<div className="hc-messages-tag-dropdown mos-react-component-root">
				<Dropdown
					label="Category"
					ariaLabel="Message category"
					options={this.returnTagDropdownOptions()}
					selectedKey={this.props.selectedKey}
					onChanged={this.props.onChanged}
					required
				/>
			</div>
		);
	}
}
