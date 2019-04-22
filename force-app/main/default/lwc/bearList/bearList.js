//these top two imports are required to publish events across sibling components in a lightning page
//first one adds an adapter that gets current page second lets us fire events across the page
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { loadStyle } from 'lightning/platformResourceLoader';
import ursusResources from '@salesforce/resourceUrl/ursus_park';
import { LightningElement, track, wire } from 'lwc';
/** BearController.searchBears(searchTerm) Apex method */
import searchBears from '@salesforce/apex/BearController.searchBears';
export default class BearListNav extends NavigationMixin(LightningElement) {
	@track searchTerm = '';
	@track bears;

	/**retrieve current page ref and store it in a property pageRef
	   wire function to capture incomint bear list data**/
	@wire(CurrentPageReference) pageRef;
	@wire(searchBears, {searchTerm: '$searchTerm'})
	//pass searchTerm as a dynamic parameter to our wired searchBears adapter so every change to searchTemr
	//loadBears is re-fired
	//customfireEvent function that is imported above  to fire this event across the whole Lightning page id by pageRef
	loadBears(result) {
		this.bears = result;
		if (result.data) {
			fireEvent(this.pageRef, 'bearListUpdate', result.data);
		}
	}
	connectedCallback() {
		loadStyle(this, ursusResources + '/style.css');
	}
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
	handleBearView(event) {
		// Navigate to bear record page
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: event.target.bear.Id,
				objectApiName: 'Bear__c',
				actionName: 'view',
			},
		});
	}
}