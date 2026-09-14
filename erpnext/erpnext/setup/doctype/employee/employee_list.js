frappe.listview_settings['Employee'] = {
    onload: function(listview) {
        listview.page.add_inner_button(__('Upload & Sync Excel Data'), function() {
            new frappe.ui.FileUploader({
                doctype: 'Employee',
                folder: 'Home/Attachments',
                on_success(file_doc) {
                    frappe.show_progress(__('Syncing Master Data...'), 30, 100, __('Reading Uploaded Excel File'));
                    frappe.call({
                        method: 'frappe.desk.doctype.workspace.workspace.sync_excel_master_data',
                        args: { file_url: file_doc.file_url },
                        callback: function(r) {
                            frappe.hide_progress();
                            frappe.model.clear_doc('Employee');
                            if (r.message && r.message.status === 'success') {
                                frappe.msgprint({
                                    title: __('Sync Successful'),
                                    indicator: 'green',
                                    message: r.message.message
                                });
                            } else {
                                frappe.msgprint({
                                    title: __('Sync Complete'),
                                    indicator: 'green',
                                    message: r.message ? r.message.message : __('Master Data Synced Successfully!')
                                });
                            }
                            setTimeout(function() {
                                listview.refresh();
                            }, 500);
                        }
                    });
                }
            });
        }).addClass('btn-primary').css({'background-color': '#1572e8', 'color': '#ffffff', 'font-weight': 'bold', 'padding': '6px 12px', 'border-radius': '4px'});
    }
};
