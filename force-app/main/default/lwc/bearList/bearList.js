import { LightningElement, track, wire } from 'lwc';
//We import the ursusResources adapter, which gives us access to a static resource associated with our app.
// We use this adapter to build an appResources object that exposes the bear silhouette image URL in the template.
import ursusResources from '@salesforce/resourceUrl/ursus_park';
/** BearController.searchBears(searchTerm) Apex method */
import searchBears from '@salesforce/apex/BearController.searchBears';
export default class BearList extends LightningElement {
	@track searchTerm = '';
	@wire(searchBears, {searchTerm: '$searchTerm'})
	bears;
	appResources = {
		bearSilhouette: ursusResources +'/img/standing-bear-silhouette.png',
	};
	handleSearchTermChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation 	 
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}
	get hasResults() {
		return (this.bears.data.length > 0);
	}
}